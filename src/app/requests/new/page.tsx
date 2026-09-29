import Link from "next/link";
import { createOpsRequest } from "@/app/actions";

const example = `Vendor is closing business locations that impact our stores in the next 90 days. Please review continuity risk, payment exposure, and whether this needs escalation.`;

export default function NewRequestPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <Link href="/" className="text-sm text-ink-muted">← Home</Link>

      <section className="mt-10 space-y-5">
        <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">Submit request</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Classify operational noise.</h1>
        <p className="max-w-2xl text-ink-muted">
          Paste a vendor notice, invoice change, customer issue, compliance note, or internal ops request.
          The system classifies it, saves it locally, and routes it into human review.
        </p>

        <form action={createOpsRequest} className="space-y-4">
          <textarea
            name="rawText"
            defaultValue={example}
            className="min-h-56 w-full border-[1.5px] border-ink bg-paper p-4 text-sm leading-6 text-ink outline-none focus:border-spot"
          />
          <button className="bg-spot px-4 py-2 font-semibold text-on-spot">
            Classify request
          </button>
        </form>
      </section>
    </main>
  );
}
