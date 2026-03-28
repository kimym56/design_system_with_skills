import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { GenerationResultViewer } from "@/components/generation-result-viewer";

test("defaults to preview and switches to code", async () => {
  const user = userEvent.setup();

  render(
    <GenerationResultViewer
      code={`export function Demo() {\n  return <button>Demo</button>;\n}`}
      markup="<button>Preview demo</button>"
    />,
  );

  const previewToggle = screen.getByRole("button", { name: /^preview$/i });
  const codeToggle = screen.getByRole("button", { name: /^code$/i });

  expect(previewToggle).toHaveAttribute("aria-pressed", "true");
  expect(codeToggle).toHaveAttribute("aria-pressed", "false");
  expect(
    screen.getByTitle(/generated component preview/i),
  ).toBeInTheDocument();
  expect(screen.queryByText(/export function demo/i)).not.toBeInTheDocument();

  await user.click(codeToggle);

  expect(previewToggle).toHaveAttribute("aria-pressed", "false");
  expect(codeToggle).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText("export")).toHaveAttribute("data-token-type", "keyword");
  expect(
    screen.getByRole("button", { name: /copy generated code/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/generated-component\.tsx/i)).toBeInTheDocument();
  expect(screen.getByText(/^tsx$/i)).toBeInTheDocument();
  expect(
    screen.queryByTitle(/generated component preview/i),
  ).not.toBeInTheDocument();
});

test("opens the active mode in a large dialog", async () => {
  const user = userEvent.setup();

  render(
    <GenerationResultViewer
      code={`export function Demo() {\n  return <button>Demo</button>;\n}`}
      markup="<button>Preview demo</button>"
    />,
  );

  await user.click(screen.getByRole("button", { name: /open large preview/i }));

  expect(screen.getByRole("dialog", { name: /large preview/i })).toBeInTheDocument();
  expect(screen.getAllByTitle(/generated component preview/i)).toHaveLength(2);

  await user.click(screen.getByRole("button", { name: /close large view/i }));

  expect(
    screen.queryByRole("dialog", { name: /large preview/i }),
  ).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /^code$/i }));
  await user.click(screen.getByRole("button", { name: /open large code/i }));

  expect(screen.getByRole("dialog", { name: /large code/i })).toBeInTheDocument();
  screen.getAllByText("export").forEach((token) => {
    expect(token).toHaveAttribute("data-token-type", "keyword");
  });
  expect(screen.getAllByText(/generated-component\.tsx/i)).toHaveLength(2);
  expect(
    screen.getAllByRole("button", { name: /copy generated code/i }),
  ).toHaveLength(2);
});
