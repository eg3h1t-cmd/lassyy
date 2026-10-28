import { describe, it, expect, vi, afterEach } from "vitest";
import { getServerEnv, hasSupabaseConfig } from "./env";

describe("env", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("parses defaults when optional vars missing", () => {
    vi.stubEnv("NODE_ENV", "test");
    const env = getServerEnv();
    expect(env.NODE_ENV).toBe("test");
  });

  it("reports supabase not configured when urls missing", () => {
    vi.stubEnv("NODE_ENV", "test");
    expect(hasSupabaseConfig()).toBe(false);
  });
});