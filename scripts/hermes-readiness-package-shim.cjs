#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function finding(id, severity, message) {
  return { id, severity, message };
}

function validate(standard, trace) {
  const findings = [];

  for (const field of standard.requiredTraceFields || []) {
    if (!hasOwn(trace, field) || trace[field] === null || trace[field] === "") {
      findings.push(finding(`missing_required_trace_field:${field}`, "fail", `Missing required trace field: ${field}`));
    }
  }

  for (const field of standard.recommendedTraceFields || []) {
    if (!hasOwn(trace, field) || trace[field] === null || trace[field] === "") {
      findings.push(finding(`missing_recommended_trace_field:${field}`, "warn", `Missing recommended trace field: ${field}`));
    }
  }

  const privacy = trace.privacy || {};
  const defaults = standard.privacyDefaults || {};

  if (privacy.allowRawPromptLogging !== defaults.allowRawPromptLogging) {
    findings.push(finding("privacy_raw_prompt_logging", "fail", "Raw prompt logging must be disabled by default."));
  }

  if (privacy.allowRawCompletionLogging !== defaults.allowRawCompletionLogging) {
    findings.push(finding("privacy_raw_completion_logging", "fail", "Raw completion logging must be disabled by default."));
  }

  if (defaults.requireRedaction && privacy.redactionEnabled !== true) {
    findings.push(finding("privacy_redaction_required", "fail", "Redaction must be enabled."));
  }

  if (
    defaults.requireSensitiveFieldList &&
    (!Array.isArray(privacy.sensitiveFields) || privacy.sensitiveFields.length === 0)
  ) {
    findings.push(finding("privacy_sensitive_fields_required", "fail", "Sensitive field list is required."));
  }

  const artifact = trace.artifact || {};
  for (const field of standard.artifactMetadata || []) {
    if (!hasOwn(artifact, field) || artifact[field] === null || artifact[field] === "") {
      findings.push(finding(`missing_artifact_metadata:${field}`, "fail", `Missing artifact metadata field: ${field}`));
    }
  }

  const summary = {
    fail: findings.filter((item) => item.severity === "fail").length,
    warn: findings.filter((item) => item.severity === "warn").length
  };

  return {
    status: summary.fail === 0 ? "pass" : "fail",
    summary,
    findings
  };
}

function buildMarkdown(report) {
  const findings = report.findings.length
    ? report.findings.map((item) => `- **${item.severity.toUpperCase()}** ${item.id}: ${item.message}`).join("\n")
    : "- No findings.";

  return `# Hermes Agent/MCP Observability Readiness Report

Status: **${report.status.toUpperCase()}**

Generated at: ${report.generated_at}

## Summary

- Failures: ${report.summary.fail}
- Warnings: ${report.summary.warn}
- Fixture: \`${report.fixture}\`
- Standard version: \`${report.standard_version}\`

## Checks

- Required trace metadata
- Recommended trace metadata
- Privacy-safe logging defaults
- Artifact metadata envelope
- JSON report generation
- Markdown report generation

## Findings

${findings}

## Next Actions

${report.status === "pass" ? "- No action required." : "- Fix failing readiness findings."}
`;
}

const standardPath = path.join(root, "standards", "readiness.json");
const fixturePath = path.join(root, "fixtures", "readiness", "valid-agent-trace.json");
const outDir = path.join(root, "reports", "readiness");
const outJson = path.join(outDir, "latest-readiness.json");
const outMd = path.join(outDir, "latest-readiness.md");

const standard = readJson(standardPath);
const trace = readJson(fixturePath);
const validation = validate(standard, trace);

const report = {
  schema_version: "0.1.0",
  tool_version: "@hermes/readiness-package-style-shim@0.1.0",
  generated_at: new Date().toISOString(),
  status: validation.status,
  standard_version: standard.version,
  fixture: path.relative(root, fixturePath),
  summary: validation.summary,
  checks: {
    requiredTraceFields: standard.requiredTraceFields || [],
    recommendedTraceFields: standard.recommendedTraceFields || [],
    privacyDefaults: standard.privacyDefaults || {},
    artifactMetadata: standard.artifactMetadata || []
  },
  findings: validation.findings
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(outMd, buildMarkdown(report));

console.log(`Hermes readiness status: ${report.status.toUpperCase()}`);
console.log(`JSON report: ${path.relative(root, outJson)}`);
console.log(`Markdown report: ${path.relative(root, outMd)}`);

if (report.status !== "pass") {
  process.exitCode = 1;
}
