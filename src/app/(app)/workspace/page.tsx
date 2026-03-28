import { CreateGenerationForm } from "@/components/create-generation-form";

export const dynamic = "force-dynamic";

export default function WorkspacePage() {
  return (
    <main className="space-y-4">
      <header className="space-y-1.5">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
          Run a component generation
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Select a component, choose approved skills, and review the output
          before saving the run.
        </p>
      </header>

      <CreateGenerationForm />
    </main>
  );
}
