// WooCommerce integration boundary (NOT operational yet).
// Future implementation must use authenticated REST API access and verify webhooks.

export interface WooCommerceCredentials {
  storeUrl: string;
  consumerKey: string; // server-only
  consumerSecret: string; // server-only
}

export interface WooCommerceAdapter {
  /** Verify webhook signature using the shared secret. */
  verifyWebhook(rawBody: string, signature: string, secret: string): boolean;
  /** Fetch products from the store. */
  fetchProducts(credentials: WooCommerceCredentials): Promise<unknown[]>;
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