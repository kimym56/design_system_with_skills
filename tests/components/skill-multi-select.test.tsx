import { render, screen } from "@testing-library/react";

import { SkillMultiSelect } from "@/components/skill-multi-select";

test("renders the empty approved-skills state with the same compact field height", () => {
  render(
    <SkillMultiSelect
      options={[]}
      selectedIds={[]}
      onToggle={() => undefined}
    />,
  );

  const emptyState = screen.getByText(/no approved skills are available yet\./i);

  expect(emptyState).toHaveClass(
    "flex",
    "min-h-9",
    "items-center",
    "rounded-[10px]",
    "px-3",
  );
  expect(screen.queryByRole("button", { name: /select skills/i })).not.toBeInTheDocument();
});
