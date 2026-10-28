"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";

const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  description: z.string().max(300).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  url: z.string().url().optional().or(z.literal("")),
});

const configSchema = z.object({
  products: z.array(productSchema).max(24),
});

export type RecommendationProduct = z.infer<typeof productSchema>;

export async function getRecommendationConfig(storeId: string): Promise<RecommendationProduct[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("store_modules")
    .select("config")
    .eq("store_id", storeId)
    .eq("module_id", "product-recommendations")
    .maybeSingle();
  const parsed = configSchema.safeParse(data?.config ?? {});
  return parsed.success ? parsed.data.products : [];
}

export async function setRecommendationConfigAction(input: { storeId: string; products: RecommendationProduct[] }) {
  const parsed = z.object({ storeId: z.string().uuid(), products: z.array(productSchema).max(24) }).safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid input" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Unauthorized" };

  const { error } = await supabase.from("store_modules").upsert(
    {
      store_id: parsed.data.storeId,
      module_id: "product-recommendations",
      enabled: true,
      config: { products: parsed.data.products },
    },
    { onConflict: "store_id,module_id" },
  );
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/dashboard/recommendations");
  return { ok: true as const };
}

export async function trackRecommendationEvent(input: {
  storeId: string;
  eventType: "impression" | "click";
  productId?: string;
}) {
  if (!hasSupabaseConfig()) return;
  const supabase = await createSupabaseServerClient();
  const service = createSupabaseServiceClient();
  const client = service ?? supabase;
  await client.from("analytics_events").insert({
    store_id: input.storeId,
    module_id: "product-recommendations",
    event_type: input.eventType === "click" ? "recommendation_click" : "recommendation_impression",
    payload: { productId: input.productId ?? null },
  });
}