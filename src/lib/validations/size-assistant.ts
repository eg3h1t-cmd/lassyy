import { z } from "zod";

export const sizeRuleSchema = z.object({
  label: z.string().min(1).max(20),
  minHeight: z.number().min(80).max(250),
  maxHeight: z.number().min(80).max(250),
  minWeight: z.number().min(20).max(300),
  maxWeight: z.number().min(20).max(300),
});

export const sizeAssistantConfigSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(300).optional(),
  sizes: z.array(sizeRuleSchema).min(1).max(12),
});

export type SizeRule = z.infer<typeof sizeRuleSchema>;
export type SizeAssistantConfig = z.infer<typeof sizeAssistantConfigSchema>;

export const defaultSizeAssistantConfig: SizeAssistantConfig = {
  title: "Bedenini bul",
  description: "Boy ve kilonu gir, sana en uygun bedeni önerelim.",
  sizes: [
    { label: "S", minHeight: 150, maxHeight: 165, minWeight: 45, maxWeight: 60 },
    { label: "M", minHeight: 160, maxHeight: 175, minWeight: 55, maxWeight: 75 },
    { label: "L", minHeight: 170, maxHeight: 185, minWeight: 70, maxWeight: 90 },
    { label: "XL", minHeight: 178, maxHeight: 200, minWeight: 85, maxWeight: 120 },
  ],
};