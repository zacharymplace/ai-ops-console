import { getAuditLog, getRequests } from "@/lib/data/store";

export default async function DashboardPage() {
  const requests = await getRequests();
  const auditLog = await getAuditLog();

  const highRisk = requests.filter((r) => r.riskLevel === "high").length;
  const mediumRisk = requests.filter((r) => r.riskLevel === "medium").length;
  const lowRisk = requests.filter((r) => r.riskLevel === "low").length;

  const newCount = requests.filter((r) => r.status === "new").length;
  const reviewedCount = requests.filter((r) => r.status === "reviewed").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  return (
    <main className="mx-auto max-w-5xl p-8">
      <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
        Control layer
      </p>
      <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <Card label="Total requests" value={requests.length} />
        <Card label="High risk" value={highRisk} />
        <Card label="Medium risk" value={mediumRisk} />
        <Card label="Low risk" value={lowRisk} />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <Card label="New" value={newCount} />
        <Card label="Reviewed" value={reviewedCount} />
        <Card label="Approved" value={approvedCount} />
        <Card label="Rejected" value={rejectedCount} />
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Audit log</h2>

        <div className="mt-4 space-y-3">
          {auditLog.map((event) => (
            <article key={event.id} className="rounded-lg border p-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{event.action}</p>
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs">
                  {event.actor}
                </span>
              </div>
              <p className="mt-2 text-zinc-600">{event.detail}</p>
              <p className="mt-1 text-xs text-zinc-400">{event.createdAt}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
