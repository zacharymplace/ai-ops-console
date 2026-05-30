const { execSync } = require("node:child_process");
const { Langfuse } = require("langfuse");

function restoreGeneratedReports() {
  try {
    execSync("git restore reports/classifier-eval.json", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });
  } catch {
    // Ignore restore failures so observability does not mask command results.
  }
}

function run(command) {
  const startedAt = Date.now();

  try {
    const output = execSync(command, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });

    restoreGeneratedReports();

    return {
      command,
      status: "pass",
      durationMs: Date.now() - startedAt,
      output: output.slice(-4000),
    };
  } catch (error) {
    restoreGeneratedReports();

    return {
      command,
      status: "fail",
      durationMs: Date.now() - startedAt,
      output: String(error.stdout || error.stderr || error.message).slice(-4000),
    };
  }
}

function gitValue(command, fallback = "unknown") {
  try {
    return execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return fallback;
  }
}

function scoreResults(results) {
  const failed = results.filter((result) => result.status !== "pass");
  const readiness = results.length ? Number(((results.length - failed.length) / results.length).toFixed(2)) : 0;
  const risk = Number((1 - readiness).toFixed(2));
  const confidence = Number((readiness * readiness).toFixed(2));

  const reasonCodes = [];

  if (failed.length === 0) reasonCodes.push("all_checks_passed");
  else reasonCodes.push("one_or_more_checks_failed");

  if (results.some((r) => r.command === "npm run lint" && r.status === "pass")) reasonCodes.push("lint_passed");
  if (results.some((r) => r.command === "npm run eval:classifier" && r.status === "pass")) reasonCodes.push("classifier_eval_passed");
  if (results.some((r) => r.command === "npm run check" && r.status === "pass")) reasonCodes.push("repo_check_passed");
  if (results.some((r) => r.command === "npm run release:ready" && r.status === "pass")) reasonCodes.push("release_ready_passed");
  if (results.some((r) => r.command === "npm run ci:summary" && r.status === "pass")) reasonCodes.push("ci_summary_available");

  let recommendation = "hold";
  if (readiness === 1) recommendation = "promote";
  else if (readiness >= 0.75) recommendation = "watch";

  return { readiness, risk, confidence, recommendation, reason_codes: reasonCodes };
}

async function main() {
  const required = ["LANGFUSE_PUBLIC_KEY", "LANGFUSE_SECRET_KEY", "LANGFUSE_HOST"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(", ")}`);
  }

  const langfuse = new Langfuse({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.LANGFUSE_SECRET_KEY,
    baseUrl: process.env.LANGFUSE_HOST,
  });

  const repo = "ai-ops-console";
  const branch = gitValue("git rev-parse --abbrev-ref HEAD");
  const commit = gitValue("git rev-parse --short HEAD");

  const commands = [
    "npm run lint",
    "npm run eval:classifier",
    "npm run check",
    "npm run release:ready",
    "npm run ci:summary"
  ];

  const trace = langfuse.trace({
    name: "ai-ops-console-review-run",
    metadata: {
      subsystem: repo,
      repo,
      branch,
      commit,
      timestamp: new Date().toISOString(),
      command_count: commands.length,
    },
    tags: ["hermes", "review", repo, "local"],
  });

  const results = commands.map((command) => {
    const result = run(command);

    trace.event({
      name: "command-result",
      metadata: {
        repo,
        branch,
        commit,
        command: result.command,
        status: result.status,
        duration_ms: result.durationMs,
        output_tail: result.output,
      },
    });

    return result;
  });

  const failed = results.filter((result) => result.status !== "pass");
  const score = scoreResults(results);

  trace.score({
    name: "readiness",
    value: score.readiness,
    comment: score.reason_codes.join(", "),
  });

  trace.score({
    name: "risk",
    value: score.risk,
    comment: score.reason_codes.join(", "),
  });

  trace.score({
    name: "confidence",
    value: score.confidence,
    comment: score.recommendation,
  });

  trace.event({
    name: "review-summary",
    metadata: {
      repo,
      branch,
      commit,
      status: failed.length ? "fail" : "pass",
      passed: results.length - failed.length,
      failed: failed.length,
      total: results.length,
    },
  });

  trace.event({
    name: "release-lineage",
    metadata: {
      repo,
      branch,
      commit,
      release_candidate: failed.length === 0,
      governance_status: failed.length === 0 ? "pass" : "fail",
      review_generation: "v1",
      readiness: score.readiness,
      confidence: score.confidence,
    },
  });

  trace.event({
    name: "final-disposition",
    metadata: {
      repo,
      branch,
      commit,
      recommendation: score.recommendation,
      reason_codes: score.reason_codes,
      readiness: score.readiness,
      risk: score.risk,
      confidence: score.confidence,
    },
  });

  await langfuse.flushAsync();

  console.log(JSON.stringify({
    trace: "ai-ops-console-review-run",
    repo,
    branch,
    commit,
    status: failed.length ? "fail" : "pass",
    passed: results.length - failed.length,
    failed: failed.length,
    total: results.length,
    score,
  }, null, 2));

  if (failed.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
