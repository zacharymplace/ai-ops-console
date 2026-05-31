const fs = require("fs");
const path = require("path");

const localPath = path.resolve("docs/hermes-observability-standard.json");
const candidatePaths = [
  process.env.HERMES_OBSERVABILITY_STANDARD_PATH,
  "../hermes-observability/dist/hermes-observability-standard.json",
  "../../hermes-observability/dist/hermes-observability-standard.json",
].filter(Boolean);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalize(value) {
  return JSON.stringify(value, null, 2) + "\n";
}

if (!fs.existsSync(localPath)) {
  throw new Error(`Local Hermes observability standard not found: ${localPath}`);
}

const local = readJson(localPath);
const upstreamPath = candidatePaths.map((p) => path.resolve(p)).find(fs.existsSync);

if (!upstreamPath) {
  console.log(`Hermes observability standard is present locally: ${localPath}`);
  console.log(`Optional upstream freshness check skipped. Checked: ${candidatePaths.join(", ")}`);
  process.exit(0);
}

const upstream = readJson(upstreamPath);

if (normalize(local) !== normalize(upstream)) {
  throw new Error(`Local Hermes observability standard is stale. Copy ${upstreamPath} to ${localPath}.`);
}

console.log(`Hermes observability standard is current: ${localPath}`);
console.log(`Compared against upstream: ${upstreamPath}`);
