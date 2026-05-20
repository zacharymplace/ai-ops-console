import { reviewOpsRequest } from "@/app/actions";
import { getRequests } from "@/lib/data/store";

export default async function ReviewQueuePage() {
  const requests = await getRequests();

  return (
    <main className="mx-auto max-w-5xl p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
            Human-in-the-loop
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Review queue</h1>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {requests.length === 0 ? (
          <p className="text-zinc-500">No requests yet.</p>
        ) : (
          requests.map((request) => (
            <article key={request.id} className="rounded-xl border p-5">
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-zinc-100 px-3 py-1">
                  {request.category}
                </span>
                <span className="rounded-full bg-zinc-100 px-3 py-1">
                  Risk: {request.riskLevel}
                </span>
                <span className="rounded-full bg-zinc-100 px-3 py-1">
                  Urgency: {request.urgency}/10
                </span>
                <span className="rounded-full bg-zinc-950 px-3 py-1 text-white">
                  {request.status}
                </span>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-zinc-800">
                {request.rawText}
              </p>

              <p className="mt-4 text-sm text-zinc-500">
                Suggested action: {request.suggestedAction}
              </p>

              {request.reviewerNote ? (
                <p className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">
                  Reviewer note: {request.reviewerNote}
                </p>
              ) : null}

              <form action={reviewOpsRequest} className="mt-5 space-y-3">
                <input type="hidden" name="requestId" value={request.id} />

                <textarea
                  name="reviewerNote"
                  rows={2}
                  className="w-full rounded-lg border p-3 text-sm"
                  placeholder="Add reviewer note..."
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    name="decision"
                    value="reviewed"
                    className="rounded-lg border px-3 py-2 text-sm"
                  >
                    Mark reviewed
                  </button>

                  <button
                    name="decision"
                    value="approved"
                    className="rounded-lg bg-zinc-950 px-3 py-2 text-sm text-white"
                  >
                    Approve
                  </button>

                  <button
                    name="decision"
                    value="rejected"
                    className="rounded-lg border px-3 py-2 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </form>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
