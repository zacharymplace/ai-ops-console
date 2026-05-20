import type { PromptRegistryEntry } from "@/lib/prompts/types";

export const promptRegistry: PromptRegistryEntry[] = [
  {
    id: "ops-classifier-v1",
    name: "Ops Request Classifier",
    version: "1.0.0",
    status: "active",
    purpose:
      "Classify operational requests by category, risk level, urgency, and suggested action.",
    modelTarget: "future-llm-classifier",
    systemPrompt:
      "You are an AI operations triage assistant. Classify requests conservatively. Escalate ambiguous business continuity, legal, compliance, payment, or customer-impact issues for human review.",
    userPromptTemplate:
      "Classify this operational request. Return category, riskLevel, urgency, suggestedAction, and rationale.\n\nRequest:\n{{rawText}}",
    evaluationNotes: [
      "Must not underclassify business continuity risk.",
      "Must not overclassify generic notes.",
      "Must preserve human review as final decision layer.",
    ],
    riskControls: [
      "Human-in-the-loop review required before action.",
      "High-risk requests should recommend escalation.",
      "Classifier outputs must be covered by evaluation cases.",
      "Prompt changes require regression test review.",
    ],
    createdAt: "2026-05-20",
  },
  {
    id: "review-note-summarizer-v0",
    name: "Reviewer Note Summarizer",
    version: "0.1.0",
    status: "draft",
    purpose:
      "Summarize reviewer notes into concise audit-friendly decision summaries.",
    modelTarget: "future-llm-summarizer",
    systemPrompt:
      "You summarize human reviewer notes into concise, neutral audit log language. Do not add facts that are not present.",
    userPromptTemplate:
      "Summarize this reviewer note for an audit log.\n\nReviewer note:\n{{reviewerNote}}",
    evaluationNotes: [
      "Must not invent missing reviewer intent.",
      "Must retain decision-relevant details.",
      "Must use neutral audit language.",
    ],
    riskControls: [
      "Original reviewer note remains stored.",
      "Summary is supplemental, not authoritative.",
      "Human can override generated summary.",
    ],
    createdAt: "2026-05-20",
  },
];
