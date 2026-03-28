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

test("uses compact toggle text while preserving dense control sizing", () => {
  render(
    <GenerationResultViewer
      code={`export function Demo() {\n  return <button>Demo</button>;\n}`}
      markup="<button>Preview demo</button>"
    />,
  );

  const previewToggle = screen.getByRole("button", { name: /^preview$/i });
  const codeToggle = screen.getByRole("button", { name: /^code$/i });
  const enlargeButton = screen.getByRole("button", {
    name: /open large preview/i,
  });

  expect(previewToggle).toHaveClass("px-2", "py-0.5", "text-sm");
  expect(codeToggle).toHaveClass("px-2", "py-0.5", "text-sm");
  expect(enlargeButton).toHaveClass("size-7");
  expect(enlargeButton.querySelector("svg")).toHaveClass("size-3");
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

test("renders a distinct loading preview skeleton for the selected component type", () => {
  const { rerender } = render(
    <GenerationResultViewer
      code={null}
      markup={null}
      isLoading
      componentType="Button"
    />,
  );

  expect(screen.getByRole("status").children).toHaveLength(1);
  expect(screen.getByText(/button silhouette/i)).toBeInTheDocument();
  expect(screen.queryByText(/^running$/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/generating button component run/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/modal silhouette/i)).not.toBeInTheDocument();

  rerender(
    <GenerationResultViewer
      code={null}
      markup={null}
      isLoading
      componentType="Modal"
    />,
  );

  expect(screen.getByRole("status").children).toHaveLength(1);
  expect(screen.getByText(/modal silhouette/i)).toBeInTheDocument();
  expect(screen.queryByText(/generating modal component run/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/button silhouette/i)).not.toBeInTheDocument();
});
