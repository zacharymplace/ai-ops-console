"use server";

import { redirect } from "next/navigation";
import { classifyRequest } from "@/lib/ai/classifier";
import { appendAuditEvent, saveRequest } from "@/lib/data/store";

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
