export type PromptStatus = "draft" | "active" | "deprecated";

export type PromptRegistryEntry = {
  id: string;
  name: string;
  version: string;
  status: PromptStatus;
  purpose: string;
  modelTarget: string;
  systemPrompt: string;
  userPromptTemplate: string;
  evaluationNotes: string[];
  riskControls: string[];
  createdAt: string;
};
