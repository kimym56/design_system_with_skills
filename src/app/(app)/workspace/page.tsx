export default function WorkspacePage() {
  return (
    <main className="flex min-h-screen flex-col bg-stone-950 px-6 py-12 text-stone-100">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10">
        <header className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-300">
            AI Skill Design System Generator
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Build a component from selected UI skills.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-stone-300">
            Choose one of the approved design system component types, combine it
            with curated UI/UX skills, and review the generated code and preview
            in one place.
          </p>
        </header>

        <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Component Builder</h2>
            <p className="text-sm leading-6 text-stone-300">
              The authenticated generation form, quota indicator, and selected
              skills will live here next.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-dashed border-amber-300/40 bg-stone-900/70 p-6 text-sm leading-6 text-stone-300">
            First delivery goal: a stable, test-covered workspace shell.
          </div>
        </section>
      </div>
    </main>
  );
}
