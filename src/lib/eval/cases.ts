import type { RequestCategory, RiskLevel } from "@/lib/data/types";

export type EvalCase = {
  id: string;
  input: string;
  expectedCategory: RequestCategory;
  expectedRiskLevel: RiskLevel;
  expectedUrgency: number;
  rationale: string;
};

export const evalCases: EvalCase[] = [
  {
    id: "vendor-location-closures",
    input: "Vendor is closing business locations that impact our stores in the next 90 days.",
    expectedCategory: "vendor_notice",
    expectedRiskLevel: "high",
    expectedUrgency: 9,
    rationale: "Vendor closure affecting stores is a business continuity risk.",
  },
  {
    id: "invoice-consolidation",
    input: "Customer wants the invoice header redacted and for daily billings to go through on one invoice only.",
    expectedCategory: "invoice_or_payment",
    expectedRiskLevel: "medium",
    expectedUrgency: 6,
    rationale: "Billing process change requires review but is not automatically critical.",
  },
  {
    id: "legal-compliance-breach",
    input: "Legal flagged a possible compliance breach and needs an urgent review by end of day.",
    expectedCategory: "compliance_risk",
    expectedRiskLevel: "high",
    expectedUrgency: 9,
    rationale: "Legal/compliance breach with urgent timing requires escalation.",
  },
  {
    id: "simple-process-cleanup",
    input: "Internal ops wants to clean up the weekly workflow checklist.",
    expectedCategory: "internal_ops",
    expectedRiskLevel: "low",
    expectedUrgency: 3,
    rationale: "Routine process cleanup is low risk.",
  },
  {
    id: "customer-complaint",
    input: "Customer submitted a complaint about support delays and wants a response today.",
    expectedCategory: "customer_support",
    expectedRiskLevel: "medium",
    expectedUrgency: 6,
    rationale: "Customer complaint needs timely handling but is not inherently high risk.",
  },
  {
    id: "unknown-general-note",
    input: "Please review this note and let me know what you think.",
    expectedCategory: "unknown",
    expectedRiskLevel: "low",
    expectedUrgency: 3,
    rationale: "Generic input should not be overclassified.",
  }
];
