import Link from "next/link";
import { createOpsRequest } from "@/app/actions";

const example = `Vendor is closing business locations that impact our stores in the next 90 days. Please review continuity risk, payment exposure, and whether this needs escalation.`;

export default function NewRequestPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <Link href="/" className="text-sm text-zinc-500">← Home</Link>

      <section className="mt-10 space-y-5">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Submit request</p>
        <h1 className="text-5xl font-semibold tracking-tight">Classify operational noise.</h1>
        <p className="max-w-2xl text-zinc-400">
          Paste a vendor notice, invoice change, customer issue, compliance note, or internal ops request.
          The system classifies it, saves it locally, and routes it into human review.
        </p>

        <form action={createOpsRequest} className="space-y-4">
          <textarea
            name="rawText"
            defaultValue={example}
            className="min-h-56 w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-100 outline-none focus:border-zinc-500"
          />
          <button className="rounded-lg bg-zinc-100 px-4 py-2 font-semibold text-zinc-950">
            Classify request
          </button>
        </form>
      </section>
    </main>
  );
}
