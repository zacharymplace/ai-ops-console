import { promises as fs } from "fs";
import path from "path";
import type { AuditEvent, OpsRequest } from "@/lib/data/types";

const DATA_DIR = path.join(process.cwd(), "data");
const REQUESTS_FILE = path.join(DATA_DIR, "requests.json");
const AUDIT_FILE = path.join(DATA_DIR, "audit-log.json");

async function ensureDataFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  for (const file of [REQUESTS_FILE, AUDIT_FILE]) {
    try {
      await fs.access(file);
    } catch {
      await fs.writeFile(file, "[]", "utf8");
    }
  }
}

export async function getRequests(): Promise<OpsRequest[]> {
  await ensureDataFiles();
  const raw = await fs.readFile(REQUESTS_FILE, "utf8");
  return JSON.parse(raw) as OpsRequest[];
}

export async function saveRequest(request: OpsRequest): Promise<void> {
  const requests = await getRequests();
  requests.unshift(request);
  await fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2));
}

export async function updateRequest(
  requestId: string,
  patch: Partial<OpsRequest>
): Promise<OpsRequest> {
  const requests = await getRequests();
  const index = requests.findIndex((request) => request.id === requestId);

  if (index === -1) {
    throw new Error(`Request not found: ${requestId}`);
  }

  const updated = {
    ...requests[index],
    ...patch,
  };

  requests[index] = updated;
  await fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2));

  return updated;
}

export async function getAuditLog(): Promise<AuditEvent[]> {
  await ensureDataFiles();
  const raw = await fs.readFile(AUDIT_FILE, "utf8");
  return JSON.parse(raw) as AuditEvent[];
}

export async function appendAuditEvent(event: AuditEvent): Promise<void> {
  const events = await getAuditLog();
  events.unshift(event);
  await fs.writeFile(AUDIT_FILE, JSON.stringify(events, null, 2));
}
