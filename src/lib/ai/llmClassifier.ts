import OpenAI from "openai";
import { classifierOutputSchema, type ClassifierOutput } from "@/lib/ai/schema";
import { promptRegistry } from "@/lib/prompts/registry";

const enabled = process.env.AI_CLASSIFIER_MODE === "llm";

export function isLlmClassifierEnabled() {
  return enabled && Boolean(process.env.OPENAI_API_KEY);
}

export async function llmClassify(rawText: string): Promise<ClassifierOutput> {
  if (!isLlmClassifierEnabled()) {
    throw new Error("LLM classifier is not enabled.");
  }

  const prompt = promptRegistry.find((entry) => entry.id === "ops-classifier-v1");

  if (!prompt) {
    throw new Error("Prompt registry entry not found: ops-classifier-v1");
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model: process.env.OPENAI_CLASSIFIER_MODEL ?? "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: prompt.systemPrompt,
      },
      {
        role: "user",
        content: prompt.userPromptTemplate.replace("{{rawText}}", rawText),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "ops_classifier_output",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            category: {
              type: "string",
              enum: [
                "customer_support",
                "vendor_notice",
                "invoice_or_payment",
                "internal_ops",
                "compliance_risk",
                "unknown",
              ],
            },
            riskLevel: {
              type: "string",
              enum: ["low", "medium", "high"],
            },
            urgency: {
              type: "integer",
              minimum: 1,
              maximum: 10,
            },
            suggestedAction: {
              type: "string",
            },
            rationale: {
              type: "string",
            },
          },
          required: [
            "category",
            "riskLevel",
            "urgency",
            "suggestedAction",
            "rationale",
          ],
        },
      },
    },
  });

  const parsed = JSON.parse(response.output_text);
  return classifierOutputSchema.parse(parsed);
}
