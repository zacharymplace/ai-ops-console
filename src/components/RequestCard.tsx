import type { OpsRequest } from "@/lib/data/types";
import { reviewOpsRequest, reclassifyOpsRequest } from "@/app/actions";

function riskClass(risk: OpsRequest["riskLevel"]) {
  if (risk === "high") return "border-red-500/40 bg-red-500/10 text-red-200";
  if (risk === "medium") return "border-yellow-500/40 bg-yellow-500/10 text-yellow-100";
  return "border-emerald-500/40 bg-emerald-500/10 text-emerald-100";
}

export function RequestCard({ request }: { request: OpsRequest }) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskClass(request.riskLevel)}`}>
          {request.riskLevel} risk
        </span>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
          urgency {request.urgency}/10
        </span>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
          {request.category}
        </span>
        <span className="ml-auto text-xs text-zinc-500">{request.status}</span>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-200">{request.rawText}</p>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-black/30 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Suggested action</p>
        <p className="mt-2 text-sm text-zinc-300">{request.suggestedAction}</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <form action={reviewOpsRequest} className="grid gap-3">
          <input type="hidden" name="requestId" value={request.id} />
          <textarea
            name="reviewerNote"
            placeholder="Reviewer note / override rationale"
            className="min-h-24 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-100 outline-none focus:border-zinc-500"
          />
          <div className="flex flex-wrap gap-2">
            <button name="decision" value="approved" className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-950">
              Accept
            </button>
            <button name="decision" value="reviewed" className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-100">
              Mark reviewed
            </button>
            <button name="decision" value="rejected" className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-100">
              Override / reject
            </button>
          </div>
        </form>

        <form action={reclassifyOpsRequest}>
          <input type="hidden" name="requestId" value={request.id} />
          <button className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-100">
            Reclassify
          </button>
        </form>
      </div>
    </article>
  );
}
