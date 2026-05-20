import type { OpsRequest, RequestCategory, RiskLevel } from "@/lib/data/types";

function inferCategory(text: string): RequestCategory {
  const t = text.toLowerCase();

  if (t.includes("invoice") || t.includes("payment") || t.includes("bill")) {
    return "invoice_or_payment";
  }

  if (t.includes("vendor") || t.includes("renewal") || t.includes("contract")) {
    return "vendor_notice";
  }

  if (t.includes("compliance") || t.includes("legal") || t.includes("risk")) {
    return "compliance_risk";
  }

  if (t.includes("customer") || t.includes("support") || t.includes("complaint")) {
    return "customer_support";
  }

  if (t.includes("process") || t.includes("workflow") || t.includes("ops")) {
    return "internal_ops";
  }

  return "unknown";
}

function inferRisk(text: string): RiskLevel {
  const t = text.toLowerCase();

  if (
    t.includes("legal") ||
    t.includes("breach") ||
    t.includes("urgent") ||
    t.includes("overdue") ||
    t.includes("compliance") ||
    t.includes("closing business") ||
    t.includes("business continuity") ||
    t.includes("impact our stores")
  ) {
    return "high";
  }

  if (
    t.includes("renewal") ||
    t.includes("payment") ||
    t.includes("customer") ||
    t.includes("deadline") ||
    t.includes("vendor") ||
    t.includes("next 90 days") ||
    t.includes("location")
  ) {
    return "medium";
  }

  return "low";
}

function inferUrgency(riskLevel: RiskLevel): number {
  if (riskLevel === "high") return 9;
  if (riskLevel === "medium") return 6;
  return 3;
}

export function classifyRequest(rawText: string): OpsRequest {
  const category = inferCategory(rawText);
  const riskLevel = inferRisk(rawText);
  const urgency = inferUrgency(riskLevel);

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    rawText,
    category,
    urgency,
    riskLevel,
    suggestedAction:
      riskLevel === "high"
        ? "Escalate for human review before action."
        : "Review, confirm classification, and assign next owner.",
    status: "new",
  };
}
