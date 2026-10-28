import { describe, it, expect } from "vitest";
import { createStoreSchema } from "./store-validation";

describe("createStoreSchema", () => {
  it("accepts valid input", () => {
    const r = createStoreSchema.safeParse({ name: "My Store", slug: "my-store" });
    expect(r.success).toBe(true);
  });

  it("rejects empty name", () => {
    const r = createStoreSchema.safeParse({ name: "", slug: "my-store" });
    expect(r.success).toBe(false);
  });

  it("rejects invalid slug", () => {
    const r = createStoreSchema.safeParse({ name: "My Store", slug: "Bad Slug!" });
    expect(r.success).toBe(false);
  });

  it("normalizes slug casing", () => {
    const r = createStoreSchema.safeParse({ name: "My Store", slug: "My-Store" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.slug).toBe("my-store");
  });
});