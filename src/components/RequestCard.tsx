import type { OpsRequest } from "@/lib/data/types";
import { reviewOpsRequest, reclassifyOpsRequest } from "@/app/actions";

function riskClass(risk: OpsRequest["riskLevel"]) {
  if (risk === "high") return "border-spot border-l-[6px] bg-spot-tint text-spot font-bold";
  if (risk === "medium") return "border-dashed border-spot bg-spot-tint text-ink";
  return "border-data border-l-[6px] bg-data-tint text-data";
}

function statusClass(status: OpsRequest["status"]) {
  if (status === "approved") return "border-data border-l-[6px] bg-data-tint text-data";
  if (status === "rejected") return "border-spot border-l-[6px] bg-spot-tint text-spot font-bold";
  if (status === "reviewed") return "border-dotted border-data border-l-[6px] bg-data-tint text-ink";
  return "border-ink text-ink-muted";
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

function formatCreatedAt(createdAt: string) {
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return createdAt;

  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
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
    <article className="border-[1.5px] border-ink bg-paper-2 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`border-[1.5px] px-3 py-1 text-xs font-semibold ${riskClass(request.riskLevel)}`}>
          {request.riskLevel} risk
        </span>
        <span className="border-[1.5px] border-ink px-3 py-1 text-xs text-ink-2">
          urgency {request.urgency}/10
        </span>
        <span className="border-[1.5px] border-ink px-3 py-1 text-xs text-ink-2">
          {request.category}
        </span>
        <span className={`ml-auto border-[1.5px] px-3 py-1 text-xs font-semibold ${statusClass(request.status)}`}>
          {request.status}
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
            Request
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink-2">
            {request.rawText}
          </p>
          <p className="mt-3 text-xs text-ink-muted">
            Created {formatCreatedAt(request.createdAt)}
          </p>
        </div>

        <aside className="border-[1.5px] border-ink bg-paper-2 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
            Operator read
          </p>
          <div className="mt-3 space-y-3 text-sm text-ink-2">
            <p>
              <span className="text-ink-muted">Owner:</span> {ownerHint(request)}
            </p>
            <p>
              <span className="text-ink-muted">Decision state:</span>{" "}
              {decisionHint(request.status)}
            </p>
            <p>
              <span className="text-ink-muted">Focus:</span>{" "}
              {reviewFocus(request)}
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-4 border-[1.5px] border-ink bg-paper-2 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
          Suggested action
        </p>
        <p className="mt-2 text-sm text-ink-2">{request.suggestedAction}</p>
      </div>

      {isPending ? (
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <form action={reviewOpsRequest} className="grid gap-3">
            <input type="hidden" name="requestId" value={request.id} />

            <div className="border-[1.5px] border-ink bg-paper-2 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
                Decision guide
              </p>
              <p className="mt-2 text-sm text-ink-2">{decisionGuide(request)}</p>
            </div>

            <textarea
              name="reviewerNote"
              placeholder={reviewPlaceholder(request)}
              className="min-h-24 border-[1.5px] border-ink bg-paper p-3 text-sm text-ink outline-none focus:border-spot"
            />
            <div className="flex flex-wrap gap-2">
              <button
                name="decision"
                value="approved"
                className="bg-spot px-3 py-2 text-sm font-semibold text-paper"
              >
                Accept
              </button>
              <button
                name="decision"
                value="reviewed"
                className="border-[1.5px] border-ink px-3 py-2 text-sm text-ink"
              >
                Mark reviewed
              </button>
              <button
                name="decision"
                value="rejected"
                className="border-[1.5px] border-ink px-3 py-2 text-sm text-ink"
              >
                Override / reject
              </button>
            </div>
          </form>

          <form action={reclassifyOpsRequest}>
            <input type="hidden" name="requestId" value={request.id} />
            <button className="border-[1.5px] border-ink px-3 py-2 text-sm text-ink">
              Reclassify
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-4 border-[1.5px] border-ink bg-paper-2 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
            Human decision
          </p>
          <p className="mt-2 text-sm text-ink-2">
            {request.reviewerNote ?? "No reviewer note recorded."}
          </p>
        </div>
      )}
    </article>
  );
}
