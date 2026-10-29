// Shopify integration boundary (NOT operational yet).
// Future implementation must use the supported app auth flow and verify webhooks.

export interface ShopifyCredentials {
  shopDomain: string;
  accessToken: string; // server-only
}

export interface ShopifyAdapter {
  verifyWebhook(rawBody: string, hmacHeader: string, secret: string): boolean;
  fetchProducts(credentials: ShopifyCredentials): Promise<unknown[]>;
}

export const shopifyNotes = {
  status: "planned",
  requirements: [
    "Supported app authentication flow",
    "Required scopes (least privilege)",
    "App extensions where appropriate",
    "Webhook signature verification",
    "Retry and duplicate-event handling",
  ],
};