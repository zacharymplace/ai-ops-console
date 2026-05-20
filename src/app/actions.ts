"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { classifyRequest } from "@/lib/ai/classifier";
import { appendAuditEvent, saveRequest, updateRequest } from "@/lib/data/store";
import type { OpsRequest } from "@/lib/data/types";

export async function createOpsRequest(formData: FormData) {
  const rawText = String(formData.get("rawText") ?? "").trim();

  if (!rawText) {
    throw new Error("Request text is required.");
  }

  const request = classifyRequest(rawText);

  await saveRequest(request);

  await appendAuditEvent({
    id: crypto.randomUUID(),
    requestId: request.id,
    createdAt: new Date().toISOString(),
    actor: "system",
    action: "classified_request",
    detail: `Classified as ${request.category}, risk ${request.riskLevel}, urgency ${request.urgency}.`,
  });

  redirect("/requests/review");
}

export async function reviewOpsRequest(formData: FormData) {
  const requestId = String(formData.get("requestId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const reviewerNote = String(formData.get("reviewerNote") ?? "").trim();

  const allowedDecisions: OpsRequest["status"][] = [
    "reviewed",
    "approved",
    "rejected",
  ];

  if (!requestId) {
    throw new Error("Request id is required.");
  }

  if (!allowedDecisions.includes(decision as OpsRequest["status"])) {
    throw new Error(`Unsupported decision: ${decision}`);
  }

  const updated = await updateRequest(requestId, {
    status: decision as OpsRequest["status"],
    reviewerNote: reviewerNote || undefined,
  });

  await appendAuditEvent({
    id: crypto.randomUUID(),
    requestId,
    createdAt: new Date().toISOString(),
    actor: "human",
    action: `request_${updated.status}`,
    detail: reviewerNote || "Human review completed without additional note.",
  });

  revalidatePath("/requests/review");
  revalidatePath("/dashboard");
}
