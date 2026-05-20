import Link from "next/link";
import { getRequests, getAuditLog } from "@/lib/data/store";

export default async function DashboardPage() {
  const [requests, auditLog] = await Promise.all([getRequests(), getAuditLog()]);
  const highRisk = requests.filter((r) => r.riskLevel === "high").length;
  const pending = requests.filter((r) => r.status === "new").length;
  const approved = requests.filter((r) => r.status === "approved").length;

  return (
    <main className="mx-auto max-w-6xl p-8">
      <Link href="/" className="text-sm text-zinc-500">← Home</Link>

      <section className="mt-10 space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Dashboard</p>
        <h1 className="text-5xl font-semibold tracking-tight">Local operating report.</h1>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Total requests", requests.length],
            ["Pending review", pending],
            ["High risk", highRisk],
            ["Approved", approved],
          ].map(([label, value]) => (
            <article key={label} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
              <p className="text-sm text-zinc-500">{label}</p>
              <p className="mt-3 text-4xl font-semibold">{value}</p>
            </article>
          ))}
        </div>

        <article className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <h2 className="text-xl font-semibold">Recent audit events</h2>
          <div className="mt-4 grid gap-3">
            {auditLog.slice(0, 10).map((event) => (
              <div key={event.id} className="text-sm text-zinc-400">
                <span className="text-zinc-200">{event.action}</span> · {event.detail}
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
