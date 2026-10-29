// iyzico integration boundary (NOT operational until credentials and checkout flow are configured).
// Keep API keys server-only. Never expose them to the browser.
//
// Required env (add to .env.local and Vercel):
//   IYZICO_API_KEY=
//   IYZICO_SECRET_KEY=
//   IYZICO_MERCHANT_ID=
//   IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
//   SUBSCRIPTIONS_ENFORCED=false

export interface IyzicoConfig {
  apiKey: string;
  secretKey: string;
  merchantId: string;
  baseUrl: string;
}

export function getIyzicoConfig(): IyzicoConfig | null {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  const merchantId = process.env.IYZICO_MERCHANT_ID;
  const baseUrl = process.env.IYZICO_BASE_URL;
  if (!apiKey || !secretKey || !merchantId || !baseUrl) return null;
  return { apiKey, secretKey, merchantId, baseUrl };
}

export interface CreateCheckoutInput {
  storeId: string;
  planId: "starter" | "growth" | "enterprise";
  buyerEmail: string;
  callbackUrl: string;
}

/**
 * Creates a hosted checkout form/session.
 * Throws until the real iyzico request is implemented and tested against sandbox.
 */
export async function createIyzicoCheckout(_input: CreateCheckoutInput): Promise<{ checkoutUrl: string }> {
  void _input;
  throw new Error("iyzico checkout is not implemented yet. Configure sandbox credentials and complete the provider adapter.");
}

/**
 * iyzico sends a signature header. The exact algorithm depends on the product
 * (Checkout Form vs Subscription API). Verify server-side before trusting payloads.
 */
export function verifyIyzicoCallbackSignature(_payload: string, _signature: string): boolean {
  void _payload;
  void _signature;
  return false;
}

export const iyzicoNotes = {
  status: "planned",
  requirements: [
    "Merchant account approval and sandbox/production credentials",
    "Choose iyzico Checkout Form or Subscription API based on merchant eligibility",
    "Server-side signature verification",
    "Idempotent webhook/callback handling using payment_events",
    "Never trust plan or payment status from the browser",
  ],
};