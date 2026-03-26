"use client";

type SkillOption = {
  id: string;
  name: string;
  description: string | null;
  githubStars: number;
};

export function SkillMultiSelect({
  options,
  selectedIds,
  onToggle,
}: {
  options: SkillOption[];
  selectedIds: string[];
  onToggle: (skillId: string) => void;
}) {
  if (options.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 p-5 text-sm leading-6 text-stone-400">
        No approved skills are available yet.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {options.map((skill) => {
        const active = selectedIds.includes(skill.id);

        return (
          <label
            key={skill.id}
            className={`flex cursor-pointer items-start gap-3 rounded-[1.25rem] border px-4 py-4 transition ${
              active
                ? "border-amber-300/60 bg-amber-300/10"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
            }`}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={() => onToggle(skill.id)}
              className="mt-1 size-4 accent-amber-300"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  {skill.name}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-stone-300">
                  {skill.githubStars} stars
                </span>
              </div>
              <p className="text-sm leading-6 text-stone-300">
                {skill.description ?? "No description available."}
              </p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
