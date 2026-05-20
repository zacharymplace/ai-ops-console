import { classifyRequest } from "@/lib/ai/classifier";
import { evalCases } from "@/lib/eval/cases";

type EvalResult = {
  id: string;
  passed: boolean;
  categoryPassed: boolean;
  riskPassed: boolean;
  urgencyPassed: boolean;
  expected: {
    category: string;
    riskLevel: string;
    urgency: number;
  };
  actual: {
    category: string;
    riskLevel: string;
    urgency: number;
  };
  rationale: string;
};

const results: EvalResult[] = evalCases.map((testCase) => {
  const actual = classifyRequest(testCase.input);

  const categoryPassed = actual.category === testCase.expectedCategory;
  const riskPassed = actual.riskLevel === testCase.expectedRiskLevel;
  const urgencyPassed = actual.urgency === testCase.expectedUrgency;

  return {
    id: testCase.id,
    passed: categoryPassed && riskPassed && urgencyPassed,
    categoryPassed,
    riskPassed,
    urgencyPassed,
    expected: {
      category: testCase.expectedCategory,
      riskLevel: testCase.expectedRiskLevel,
      urgency: testCase.expectedUrgency,
    },
    actual: {
      category: actual.category,
      riskLevel: actual.riskLevel,
      urgency: actual.urgency,
    },
    rationale: testCase.rationale,
  };
});

import { mkdirSync, writeFileSync } from "node:fs";

const passed = results.filter((r) => r.passed).length;
const failed = results.length - passed;
const score = Math.round((passed / results.length) * 100);

mkdirSync("reports", { recursive: true });
writeFileSync(
  "reports/classifier-eval.json",
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      cases: results.length,
      passed,
      failed,
      score,
      results,
    },
    null,
    2
  )
);

console.log("\nAI Ops Console classifier evaluation");
console.log("====================================");
console.log(`Cases: ${results.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Score: ${score}%`);
console.log("Report: reports/classifier-eval.json");

for (const result of results) {
  const status = result.passed ? "PASS" : "FAIL";

  console.log(`\n[${status}] ${result.id}`);
  console.log(`Rationale: ${result.rationale}`);
  console.log("Expected:", result.expected);
  console.log("Actual:  ", result.actual);

  if (!result.passed) {
    console.log("Failures:", {
      category: !result.categoryPassed,
      risk: !result.riskPassed,
      urgency: !result.urgencyPassed,
    });
  }
}

if (failed > 0) {
  process.exit(1);
}
