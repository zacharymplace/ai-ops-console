import Link from "next/link";
import { RequestCard } from "@/components/RequestCard";
import { getRequests, getAuditLog } from "@/lib/data/store";

export default async function ReviewQueuePage() {
  const [requests, auditLog] = await Promise.all([getRequests(), getAuditLog()]);

  return (
    <main className="mx-auto max-w-6xl p-8">
      <Link href="/" className="text-sm text-zinc-500">← Home</Link>

      <section className="mt-10 space-y-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Review queue</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight">Human review surface.</h1>
          </div>
          <Link href="/requests/new" className="ml-auto rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950">
            New request
          </Link>
        </div>

        <div className="grid gap-4">
          {requests.length ? requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          )) : (
            <div className="rounded-2xl border border-zinc-800 p-6 text-zinc-400">
              No requests yet. Submit one to test the review loop.
            </div>
          )}
        </div>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <h2 className="text-xl font-semibold">Audit trail</h2>
          <div className="mt-4 grid gap-3">
            {auditLog.slice(0, 8).map((event) => (
              <div key={event.id} className="rounded-xl border border-zinc-800 p-3 text-sm">
                <p className="text-zinc-300">{event.action}</p>
                <p className="mt-1 text-xs text-zinc-500">{event.createdAt} · {event.actor}</p>
                <p className="mt-2 text-zinc-400">{event.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
