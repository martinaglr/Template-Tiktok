import type { Order, OrderStatus } from "@/types/order";

export type { Order };

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  getById(id: string): Promise<Order | null>;
  updateStatus(
    id: string,
    status: OrderStatus,
    providerRef?: string,
  ): Promise<Order | null>;
}
