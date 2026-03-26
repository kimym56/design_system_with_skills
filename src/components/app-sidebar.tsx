import Link from "next/link";

const navigation = [
  { href: "/workspace", label: "Workspace" },
  { href: "/history", label: "History" },
  { href: "/admin/skills", label: "Admin" },
];

export function AppSidebar() {
  return (
    <aside className="flex h-full flex-col justify-between rounded-[1.75rem] border border-white/10 bg-stone-950 px-5 py-6 text-stone-100">
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-amber-300">
            Design System AI
          </p>
          <h2 className="text-xl font-semibold tracking-tight">
            Skill-Guided Builder
          </h2>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-2xl border border-transparent bg-white/5 px-4 py-3 text-sm font-medium transition hover:border-amber-300/40 hover:bg-white/10"
            >
              <span>{item.label}</span>
              <span className="text-xs text-stone-400">Open</span>
            </Link>
          ))}
        </nav>
      </div>

      <p className="text-sm leading-6 text-stone-400">
        Google-authenticated workspace with quota-gated generation and saved
        preview history.
      </p>
    </aside>
  );
}
