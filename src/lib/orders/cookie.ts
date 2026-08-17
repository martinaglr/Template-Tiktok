import { cookies } from "next/headers";
import type { Order, OrderStatus } from "@/types/order";
import type { OrderRepository } from "./types";

const COOKIE_NAME = "demo_order";
const COOKIE_MAX_AGE = 60 * 60; // 1 hour — plenty for a demo click-through

/**
 * Ephemeral store for the demo: the order rides along in an httpOnly cookie
 * on the buyer's browser instead of server memory. A plain module-scope Map
 * doesn't work here — Next.js bundles route handlers and page components as
 * separate module graphs (confirmed: a Map written in POST /api/orders was
 * invisible to /pago/[orderId]'s page render, even in single-process
 * `next dev`), and Cloudflare Workers can additionally run separate isolates
 * per request. Swapped for a D1-backed OrderRepository (see
 * lib/orders/types.ts) once persistence is needed.
 */
export class CookieOrderRepository implements OrderRepository {
  async create(order: Order): Promise<Order> {
    await this.write(order);
    return order;
  }

  async getById(id: string): Promise<Order | null> {
    const store = await cookies();
    const raw = store.get(COOKIE_NAME)?.value;
    if (!raw) return null;
    const order = JSON.parse(raw) as Order;
    return order.id === id ? order : null;
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    providerRef?: string,
  ): Promise<Order | null> {
    const existing = await this.getById(id);
    if (!existing) return null;
    const updated: Order = {
      ...existing,
      status,
      providerRef: providerRef ?? existing.providerRef,
    };
    await this.write(updated);
    return updated;
  }

  private async write(order: Order) {
    const store = await cookies();
    store.set(COOKIE_NAME, JSON.stringify(order), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }
}
