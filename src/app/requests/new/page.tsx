import { createOpsRequest } from "@/app/actions";

export default function NewRequestPage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold">New ops request</h1>

      <form action={createOpsRequest} className="mt-6 space-y-4">
        <textarea
          name="rawText"
          required
          rows={10}
          className="w-full rounded-lg border p-4"
          placeholder="Paste a customer request, vendor notice, invoice issue, internal ops problem, or compliance concern..."
        />

        <button className="rounded-lg bg-zinc-950 px-4 py-2 text-white">
          Classify request
        </button>
      </form>
    </main>
  );
}
