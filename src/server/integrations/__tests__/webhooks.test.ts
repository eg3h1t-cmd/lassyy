import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { verifyWooCommerceWebhook } from "../woocommerce";
import { verifyShopifyWebhook } from "../shopify";

describe("webhook verification", () => {
  const secret = "test-secret";
  const body = '{"id":1}';

  it("verifies valid WooCommerce signature", () => {
    const sig = createHmac("sha256", secret).update(body).digest("base64");
    expect(verifyWooCommerceWebhook(body, sig, secret)).toBe(true);
  });

  it("rejects invalid WooCommerce signature", () => {
    expect(verifyWooCommerceWebhook(body, "bad", secret)).toBe(false);
  });

  it("verifies valid Shopify signature", () => {
    const sig = createHmac("sha256", secret).update(body).digest("base64");
    expect(verifyShopifyWebhook(body, sig, secret)).toBe(true);
  });

  it("rejects invalid Shopify signature", () => {
    expect(verifyShopifyWebhook(body, "bad", secret)).toBe(false);
  });
});