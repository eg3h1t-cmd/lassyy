import { z } from "zod";

export const countdownConfigSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  endsAt: z.string().datetime(),
  startsAt: z.string().datetime().optional().nullable(),
});

export type CountdownConfig = z.infer<typeof countdownConfigSchema>;

export function getDefaultCountdownConfig(): CountdownConfig {
  return {
    title: "Limited time offer",
    description: "",
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}
