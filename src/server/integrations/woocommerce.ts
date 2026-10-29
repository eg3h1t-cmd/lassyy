// WooCommerce integration boundary (NOT operational yet).
// Future implementation must use authenticated REST API access and verify webhooks.

export interface WooCommerceCredentials {
  storeUrl: string;
  consumerKey: string; // server-only
  consumerSecret: string; // server-only
}

import { createHmac, timingSafeEqual } from "node:crypto";

export interface WooCommerceAdapter {
  /** Verify webhook signature using the shared secret. */
  verifyWebhook(rawBody: string, signature: string, secret: string): boolean;
  /** Fetch products from the store. */
  fetchProducts(credentials: WooCommerceCredentials): Promise<unknown[]>;
}

export function verifyWooCommerceWebhook(rawBody: string, signature: string, secret: string): boolean {
  const hmac = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  try {
    return timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));
  } catch {
    return false;
  }
}

export const woocommerceNotes = {
  status: "planned",
  requirements: [
    "Authenticated REST API access (consumer key/secret)",
    "Webhook signature verification",
    "Least-privilege permissions",
    "Retry and duplicate-event handling",
  ],
};