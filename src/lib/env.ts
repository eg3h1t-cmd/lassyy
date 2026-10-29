import { z } from "zod";

const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

const serverSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  SUPABASE_SERVICE_ROLE_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  UPSTASH_REDIS_REST_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  UPSTASH_REDIS_REST_TOKEN: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  IYZICO_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  IYZICO_SECRET_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  IYZICO_MERCHANT_ID: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  IYZICO_BASE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  SUBSCRIPTIONS_ENFORCED: z.preprocess(emptyToUndefined, z.enum(["true", "false"]).optional()),
  WHATSAPP_ACCESS_TOKEN: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  WHATSAPP_PHONE_NUMBER_ID: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  WHATSAPP_API_VERSION: z.preprocess(emptyToUndefined, z.string().optional()),
  WHATSAPP_VERIFY_TOKEN: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  WHATSAPP_APP_SECRET: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  SHIPPING_WEBHOOK_SECRET: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  CART_WEBHOOK_SECRET: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  CRON_SECRET: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type ServerEnv = z.infer<typeof serverSchema>;

export function getServerEnv(): ServerEnv {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid server environment: ${parsed.error.message}`);
  }
  const data = parsed.data;
  // Treat service role key as unset if it is empty or accidentally equals the anon key.
  if (!data.SUPABASE_SERVICE_ROLE_KEY || data.SUPABASE_SERVICE_ROLE_KEY === data.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    data.SUPABASE_SERVICE_ROLE_KEY = undefined;
  }
  return data;
}

export function hasSupabaseConfig(): boolean {
  const env = getServerEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

const publicSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.preprocess(emptyToUndefined, z.string().default("lassyy")),
  NEXT_PUBLIC_APP_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
});

export type PublicEnv = z.infer<typeof publicSchema>;

export function getPublicEnv(): PublicEnv {
  const parsed = publicSchema.safeParse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME === "" ? undefined : process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL === "" ? undefined : process.env.NEXT_PUBLIC_APP_URL,
  });
  if (!parsed.success) {
    throw new Error(`Invalid public environment: ${parsed.error.message}`);
  }
  return parsed.data;
}