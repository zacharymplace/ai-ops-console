import type { OpsRequest } from "@/lib/data/types";
import { reviewOpsRequest, reclassifyOpsRequest } from "@/app/actions";

function riskClass(risk: OpsRequest["riskLevel"]) {
  if (risk === "high") return "border-red-500/40 bg-red-500/10 text-red-200";
  if (risk === "medium") return "border-yellow-500/40 bg-yellow-500/10 text-yellow-100";
  return "border-emerald-500/40 bg-emerald-500/10 text-emerald-100";
}

function statusClass(status: OpsRequest["status"]) {
  if (status === "approved") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
  if (status === "rejected") return "border-red-500/40 bg-red-500/10 text-red-200";
  if (status === "reviewed") return "border-blue-500/40 bg-blue-500/10 text-blue-200";
  return "border-zinc-700 text-zinc-400";
}

function ownerHint(request: OpsRequest) {
  if (request.category === "compliance_risk") return "Legal / Compliance owner";
  if (request.category === "invoice_or_payment") return "Finance operations owner";
  if (request.category === "vendor_notice") return "Vendor / continuity owner";
  if (request.category === "customer_support") return "Customer support owner";
  if (request.category === "internal_ops") return "Internal operations owner";
  return "Operator judgment required";
}

function reviewFocus(request: OpsRequest) {
  if (request.riskLevel === "high") {
    return "Confirm escalation path before approving. Add a reviewer note if the system classification is accepted or overridden.";
  }

  if (request.riskLevel === "medium") {
    return "Confirm the owner and next step. Mark reviewed if the classification is useful but does not need approval.";
  }

  return "Check whether this is routine noise or needs a clearer owner before closing.";
}

function decisionHint(status: OpsRequest["status"]) {
  if (status === "approved") return "Accepted by a human reviewer.";
  if (status === "rejected") return "Overridden or rejected by a human reviewer.";
  if (status === "reviewed") return "Reviewed without full approval.";
  return "Awaiting human decision.";
}

function decisionGuide(request: OpsRequest) {
  if (request.riskLevel === "high") {
    return "Accept only when the escalation path is clear. Reject when the category, risk, or urgency needs correction.";
  }

  if (request.riskLevel === "medium") {
    return "Confirm the owner and next step. Mark reviewed when the classification is usable but does not need approval.";
  }

  return "Close only after confirming this is routine work or clearly assigning an owner.";
}

function reviewPlaceholder(request: OpsRequest) {
  if (request.riskLevel === "high") {
    return "Escalation owner, business impact, and why this classification is accepted or overridden.";
  }

  if (request.riskLevel === "medium") {
    return "Owner, next step, and any reason this does or does not need escalation.";
  }

  return "Why this can stay low risk, or what would make it worth escalating.";
}

export function RequestCard({ request }: { request: OpsRequest }) {
  const isPending = request.status === "new";

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
        <span className={`ml-auto rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(request.status)}`}>
          {request.status}
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Request
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
            {request.rawText}
          </p>
          <p className="mt-3 text-xs text-zinc-500">
            Created {request.createdAt}
          </p>
        </div>

        <aside className="rounded-xl border border-zinc-800 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Operator read
          </p>
          <div className="mt-3 space-y-3 text-sm text-zinc-300">
            <p>
              <span className="text-zinc-500">Owner:</span> {ownerHint(request)}
            </p>
            <p>
              <span className="text-zinc-500">Decision state:</span>{" "}
              {decisionHint(request.status)}
            </p>
            <p>
              <span className="text-zinc-500">Focus:</span>{" "}
              {reviewFocus(request)}
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-black/30 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Suggested action
        </p>
        <p className="mt-2 text-sm text-zinc-300">{request.suggestedAction}</p>
      </div>

      {isPending ? (
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <form action={reviewOpsRequest} className="grid gap-3">
            <input type="hidden" name="requestId" value={request.id} />

            <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Decision guide
              </p>
              <p className="mt-2 text-sm text-zinc-300">{decisionGuide(request)}</p>
            </div>

            <textarea
              name="reviewerNote"
              placeholder={reviewPlaceholder(request)}
              className="min-h-24 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-100 outline-none focus:border-zinc-500"
            />
            <div className="flex flex-wrap gap-2">
              <button
                name="decision"
                value="approved"
                className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-950"
              >
                Accept
              </button>
              <button
                name="decision"
                value="reviewed"
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-100"
              >
                Mark reviewed
              </button>
              <button
                name="decision"
                value="rejected"
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-100"
              >
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
      ) : (
        <div className="mt-4 rounded-xl border border-zinc-800 bg-black/30 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Human decision
          </p>
          <p className="mt-2 text-sm text-zinc-300">
            {request.reviewerNote ?? "No reviewer note recorded."}
          </p>
        </div>
      )}
    </article>
  );
}
