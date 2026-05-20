export type RequestCategory =
  | "customer_support"
  | "vendor_notice"
  | "invoice_or_payment"
  | "internal_ops"
  | "compliance_risk"
  | "unknown";

export type RiskLevel = "low" | "medium" | "high";

export type OpsRequest = {
  id: string;
  createdAt: string;
  rawText: string;
  category: RequestCategory;
  urgency: number;
  riskLevel: RiskLevel;
  suggestedAction: string;
  status: "new" | "reviewed" | "approved" | "rejected";
  reviewerNote?: string;
};

export type AuditEvent = {
  id: string;
  requestId: string;
  createdAt: string;
  actor: "system" | "human";
  action: string;
  detail: string;
};
