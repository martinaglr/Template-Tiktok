import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Order, OrderItem, OrderStatus } from "@/types/order";
import type { Customer } from "@/types/customer";
import type { ShippingAddress } from "@/types/shipping";
import type { OrderRepository } from "./types";
import { decideStatusTransition } from "./transition";

type OrderRow = {
  id: string;
  status: OrderStatus;
  total: number;
  items_json: string;
  customer_json: string;
  shipping_json: string;
  provider_ref: string | null;
  created_at: string;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    items: JSON.parse(row.items_json) as OrderItem[],
    total: row.total,
    customer: JSON.parse(row.customer_json) as Customer,
    shippingAddress: JSON.parse(row.shipping_json) as ShippingAddress,
    status: row.status,
    providerRef: row.provider_ref ?? undefined,
    createdAt: row.created_at,
  };
}

/**
 * D1-backed order persistence. JSON columns (items/customer/shipping) are
 * serialized only at this boundary — everywhere else in the app speaks the
 * typed `Order`. `subtotal`/`shipping_cost` are written equal to
 * total/0 until Phase 3 adds real shipping cost to the `Order` type.
 */
export class D1OrderRepository implements OrderRepository {
  private async db() {
    const { env } = await getCloudflareContext({ async: true });
    return env.DB;
  }

  async create(order: Order): Promise<Order> {
    const db = await this.db();
    await db
      .prepare(
        `INSERT INTO orders
          (id, status, subtotal, shipping_cost, total, items_json, customer_json,
           shipping_json, provider_ref, provider_token, created_at, updated_at,
           paid_at, emails_sent_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, NULL, NULL)`,
      )
      .bind(
        order.id,
        order.status,
        order.total,
        0,
        order.total,
        JSON.stringify(order.items),
        JSON.stringify(order.customer),
        JSON.stringify(order.shippingAddress),
        order.providerRef ?? null,
        order.createdAt,
        order.createdAt,
      )
      .run();
    return order;
  }

  async getById(id: string): Promise<Order | null> {
    const db = await this.db();
    const row = await db
      .prepare(`SELECT * FROM orders WHERE id = ?`)
      .bind(id)
      .first<OrderRow>();
    return row ? rowToOrder(row) : null;
  }

  async getByProviderToken(token: string): Promise<Order | null> {
    const db = await this.db();
    const row = await db
      .prepare(`SELECT * FROM orders WHERE provider_token = ?`)
      .bind(token)
      .first<OrderRow>();
    return row ? rowToOrder(row) : null;
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    providerRef?: string,
  ): Promise<Order | null> {
    const db = await this.db();
    const current = await db
      .prepare(`SELECT * FROM orders WHERE id = ?`)
      .bind(id)
      .first<OrderRow>();
    if (!current) return null;

    const decision = decideStatusTransition(current.status, status);
    if (!decision.apply) {
      if (decision.reason === "downgrade-from-paid") {
        console.error(
          `[orders] refused to downgrade paid order ${id} to "${status}" — order stays paid`,
        );
      }
      return rowToOrder(current);
    }

    const now = new Date().toISOString();
    await db
      .prepare(
        `UPDATE orders
           SET status = ?, provider_ref = COALESCE(?, provider_ref),
               updated_at = ?, paid_at = CASE WHEN ? THEN ? ELSE paid_at END
         WHERE id = ?`,
      )
      .bind(status, providerRef ?? null, now, decision.stampPaidAt ? 1 : 0, now, id)
      .run();

    return this.getById(id);
  }

  async attachProviderRef(id: string, providerRef: string, token: string): Promise<void> {
    const db = await this.db();
    await db
      .prepare(
        `UPDATE orders SET provider_ref = ?, provider_token = ?, updated_at = ? WHERE id = ?`,
      )
      .bind(providerRef, token, new Date().toISOString(), id)
      .run();
  }

  async markEmailsSent(id: string): Promise<boolean> {
    const db = await this.db();
    const result = await db
      .prepare(
        `UPDATE orders SET emails_sent_at = ? WHERE id = ? AND emails_sent_at IS NULL`,
      )
      .bind(new Date().toISOString(), id)
      .run();
    return result.meta.changes > 0;
  }
}
