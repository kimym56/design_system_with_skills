import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { ComponentTypeSelect } from "@/components/component-type-select";

test("opens the dropdown, selects a new component type, and closes", async () => {
  const user = userEvent.setup();
  const onSelect = vi.fn();

  render(
    <div>
      <p id="component-type-label">Component type</p>
      <ComponentTypeSelect
        value="Button"
        onSelect={onSelect}
        labelId="component-type-label"
      />
    </div>,
  );

  await user.click(
    screen.getByRole("button", { name: /component type button/i }),
  );

  expect(
    screen.getByText(/single-line text fields for forms and search\./i),
  ).toBeInTheDocument();

  await user.click(screen.getByText(/^input$/i));

  expect(onSelect).toHaveBeenCalledWith("Input");
  expect(
    screen.queryByText(/single-line text fields for forms and search\./i),
  ).not.toBeInTheDocument();
});
