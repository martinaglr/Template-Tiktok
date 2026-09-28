import type { ProductRepository } from "./products/types";
import { StaticProductRepository } from "./products/static";
import type { PaymentProvider } from "./payments/types";
import { MockPaymentProvider } from "./payments/mock";
import type { OrderRepository } from "./orders/types";
import { D1OrderRepository } from "./orders/d1";
import type { MediaSource } from "./media/types";
import { LocalMediaSource } from "./media/local";

/**
 * Single wiring point for the four seams. Pages, components, and API routes
 * import from here — never from a concrete implementation directly. Swap an
 * implementation by changing the line below, nothing else.
 */
export const productRepository: ProductRepository = new StaticProductRepository();
export const paymentProvider: PaymentProvider = new MockPaymentProvider();
export const orderRepository: OrderRepository = new D1OrderRepository();
export const mediaSource: MediaSource = new LocalMediaSource();
