import { z } from "zod";

export const classifierOutputSchema = z.object({
  category: z.enum([
    "customer_support",
    "vendor_notice",
    "invoice_or_payment",
    "internal_ops",
    "compliance_risk",
    "unknown",
  ]),
  riskLevel: z.enum(["low", "medium", "high"]),
  urgency: z.number().int().min(1).max(10),
  suggestedAction: z.string().min(1),
  rationale: z.string().min(1),
});

export type ClassifierOutput = z.infer<typeof classifierOutputSchema>;
