import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string().trim().min(1, "Ad zorunludur.").max(120, "Ad çok uzun."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{3,60}$/, "Slug 3-60 karakterlik küçük harf, rakam veya tire olmalıdır."),
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>;