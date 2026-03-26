import { CreateGenerationForm } from "@/components/create-generation-form";

export default function WorkspacePage() {
  return (
    <main className="space-y-8">
      <header className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-300">
          AI Skill Design System Generator
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Build a component from selected UI skills.
        </h1>
        <p className="max-w-3xl text-base leading-7 text-stone-300">
          Choose one approved component type, combine it with GitHub-published
          UI/UX skills from your catalog, and review both the generated code and
          a safe rendered preview before saving it to history.
        </p>
      </header>

      <CreateGenerationForm />
    </main>
  );
}
