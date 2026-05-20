import { getRequests } from "@/lib/data/store";

export default async function ReviewQueuePage() {
  const requests = await getRequests();

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-3xl font-semibold">Review queue</h1>

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
                <span className="rounded-full bg-zinc-100 px-3 py-1">
                  {request.status}
                </span>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-zinc-800">
                {request.rawText}
              </p>

              <p className="mt-4 text-sm text-zinc-500">
                Suggested action: {request.suggestedAction}
              </p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
