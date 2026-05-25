"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { classifyRequest, classifyRequestWithMode } from "@/lib/ai/classifier";
import { appendAuditEvent, getRequests, saveRequest, updateRequest } from "@/lib/data/store";
import type { OpsRequest } from "@/lib/data/types";

export async function createOpsRequest(formData: FormData) {
  const rawText = String(formData.get("rawText") ?? "").trim();

  if (!rawText) {
    throw new Error("Request text is required.");
  }

  const classification = await classifyRequestWithMode(rawText);
  const request = classification.request;

  await saveRequest(request);

  await appendAuditEvent({
    id: crypto.randomUUID(),
    requestId: request.id,
    createdAt: new Date().toISOString(),
    actor: "system",
    action: "classified_request",
    detail: `Mode: ${classification.mode}. Classified as ${request.category}, risk ${request.riskLevel}, urgency ${request.urgency}. Rationale: ${classification.rationale}`,
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

  const existing = (await getRequests()).find((r) => r.id === requestId);

  if (!existing) {
    throw new Error(`Request not found: ${requestId}`);
  }

  if (existing.status !== "new") {
    throw new Error(
      `Request ${requestId} has already been decided (status: ${existing.status}). Only new requests can be reviewed.`
    );
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

export async function reclassifyOpsRequest(formData: FormData) {
  const requestId = String(formData.get("requestId") ?? "");

  if (!requestId) {
    throw new Error("Request id is required.");
  }

  const existing = (await getRequests()).find((request) => request.id === requestId);

  if (!existing) {
    throw new Error(`Request not found: ${requestId}`);
  }

  const reclassified = classifyRequest(existing.rawText);

  await updateRequest(requestId, {
    category: reclassified.category,
    riskLevel: reclassified.riskLevel,
    urgency: reclassified.urgency,
    suggestedAction: reclassified.suggestedAction,
  });

  await appendAuditEvent({
    id: crypto.randomUUID(),
    requestId,
    createdAt: new Date().toISOString(),
    actor: "system",
    action: "reclassified_request",
    detail: [
      `Category: ${existing.category} -> ${reclassified.category}`,
      `Risk: ${existing.riskLevel} -> ${reclassified.riskLevel}`,
      `Urgency: ${existing.urgency} -> ${reclassified.urgency}`,
    ].join("; "),
  });

  revalidatePath("/requests/review");
  revalidatePath("/dashboard");
}
