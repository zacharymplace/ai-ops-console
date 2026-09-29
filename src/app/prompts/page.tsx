import { promptRegistry } from "@/lib/prompts/registry";

export default function PromptsPage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <p className="text-sm uppercase tracking-[0.25em] text-ink-muted">
        Prompt governance
      </p>

      <h1 className="mt-2 text-3xl font-semibold">Prompt registry</h1>

      <p className="mt-4 max-w-3xl text-ink-muted">
        Versioned prompt records for future LLM-powered workflows. The current
        classifier is deterministic, but this registry defines how prompt-based
        components will be governed, reviewed, and evaluated.
      </p>

      <div className="mt-8 space-y-5">
        {promptRegistry.map((prompt) => (
          <article key={prompt.id} className="border-[1.5px] p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">{prompt.name}</h2>
              <span className="bg-paper-3 px-3 py-1 text-xs">
                {prompt.version}
              </span>
              <span className="bg-ink px-3 py-1 text-xs text-paper">
                {prompt.status}
              </span>
            </div>

            <p className="mt-3 text-ink-muted">{prompt.purpose}</p>

            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-sm font-medium">Prompt ID</dt>
                <dd className="mt-1 text-sm text-ink-muted">{prompt.id}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium">Model target</dt>
                <dd className="mt-1 text-sm text-ink-muted">
                  {prompt.modelTarget}
                </dd>
              </div>
            </dl>

            <section className="mt-5">
              <h3 className="text-sm font-medium">System prompt</h3>
              <pre className="mt-2 whitespace-pre-wrap bg-paper-2 p-4 text-sm text-ink-2">
                {prompt.systemPrompt}
              </pre>
            </section>

            <section className="mt-5">
              <h3 className="text-sm font-medium">User prompt template</h3>
              <pre className="mt-2 whitespace-pre-wrap bg-paper-2 p-4 text-sm text-ink-2">
                {prompt.userPromptTemplate}
              </pre>
            </section>

            <section className="mt-5 grid gap-4 md:grid-cols-2">
              <List title="Evaluation notes" items={prompt.evaluationNotes} />
              <List title="Risk controls" items={prompt.riskControls} />
            </section>
          </article>
        ))}
      </div>
    </main>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
