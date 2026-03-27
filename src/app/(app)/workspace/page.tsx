import { CreateGenerationForm } from "@/components/create-generation-form";

export default function WorkspacePage() {
  return (
    <main className="space-y-8">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
          Workspace
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
          Run a component generation
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground">
          Choose one component type and approved skills, then review the
          rendered preview and source before you save the run.
        </p>
      </header>

      <CreateGenerationForm />
    </main>
  );
}
