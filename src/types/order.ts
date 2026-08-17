import type { Money } from "./money";
import type { Customer } from "./customer";
import type { ShippingAddress } from "./shipping";

export type OrderStatus = "pending" | "paid" | "rejected";

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: Money;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: Money;
  customer: Customer;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  providerRef?: string;
  createdAt: string; // ISO 8601
};
