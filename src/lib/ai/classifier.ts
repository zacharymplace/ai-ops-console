import { deterministicClassify, outputToOpsRequest } from "@/lib/ai/deterministicClassifier";
import { isLlmClassifierEnabled, llmClassify } from "@/lib/ai/llmClassifier";
import type { OpsRequest } from "@/lib/data/types";

export type ClassificationMode = "deterministic" | "llm" | "llm_fallback";

export type ClassificationResult = {
  request: OpsRequest;
  mode: ClassificationMode;
  rationale: string;
};

export function classifyRequest(rawText: string): OpsRequest {
  const output = deterministicClassify(rawText);
  return outputToOpsRequest(rawText, output);
}

export async function classifyRequestWithMode(rawText: string): Promise<ClassificationResult> {
  if (isLlmClassifierEnabled()) {
    try {
      const output = await llmClassify(rawText);

      return {
        request: outputToOpsRequest(rawText, output),
        mode: "llm",
        rationale: output.rationale,
      };
    } catch (error) {
      const output = deterministicClassify(rawText);

      return {
        request: outputToOpsRequest(rawText, output),
        mode: "llm_fallback",
        rationale:
          error instanceof Error
            ? `LLM classification failed; deterministic fallback used. ${error.message}`
            : "LLM classification failed; deterministic fallback used.",
      };
    }
  }

  const output = deterministicClassify(rawText);

  return {
    request: outputToOpsRequest(rawText, output),
    mode: "deterministic",
    rationale: output.rationale,
  };
}
