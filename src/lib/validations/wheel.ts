import { z } from "zod";

export const wheelSegmentSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(60),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  prizeType: z.enum(["coupon", "none"]),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.number().min(0).max(100).optional(),
  weight: z.number().int().min(1).max(1000),
});

export const wheelConfigSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  segments: z.array(wheelSegmentSchema).min(2).max(12),
  spinDurationMs: z.number().int().min(2000).max(8000).default(4000),
});

export type WheelSegment = z.infer<typeof wheelSegmentSchema>;
export type WheelConfig = z.infer<typeof wheelConfigSchema>;

export const defaultWheelConfig: WheelConfig = {
  title: "Spin to win",
  description: "",
  spinDurationMs: 4000,
  segments: [
    { id: "s1", label: "10% off", color: "#ef4444", prizeType: "coupon", discountType: "percentage", discountValue: 10, weight: 40 },
    { id: "s2", label: "15% off", color: "#f59e0b", prizeType: "coupon", discountType: "percentage", discountValue: 15, weight: 25 },
    { id: "s3", label: "Free shipping", color: "#10b981", prizeType: "coupon", discountType: "fixed", discountValue: 0, weight: 20 },
    { id: "s4", label: "Try again", color: "#6b7280", prizeType: "none", weight: 15 },
  ],
};