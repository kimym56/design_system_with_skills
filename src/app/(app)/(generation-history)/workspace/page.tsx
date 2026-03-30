import { CreateGenerationForm } from "@/components/create-generation-form";
import { requireUserSession } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  await requireUserSession("/workspace");

  return (
    <main className="space-y-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
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
