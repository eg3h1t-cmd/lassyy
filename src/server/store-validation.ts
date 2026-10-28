import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name is too long"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{3,60}$/, "Slug must be 3-60 lowercase letters, numbers, or hyphens"),
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>;