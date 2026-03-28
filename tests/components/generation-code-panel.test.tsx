import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { GenerationCodePanel } from "@/components/generation-code-panel";

test("renders editor chrome, fallback file label, and visible line numbers", () => {
  render(
    <GenerationCodePanel
      code={`export function Demo() {\n  return <button>Demo</button>;\n}`}
    />,
  );

  expect(screen.getByText(/generated-component\.tsx/i)).toBeInTheDocument();
  expect(screen.getByText(/^tsx$/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /copy generated code/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/^1$/)).toBeInTheDocument();
  expect(screen.getByText(/^3$/)).toBeInTheDocument();
});

test("keeps the faux IDE frame for the empty state", () => {
  render(<GenerationCodePanel code={null} />);

  expect(
    screen.getByText(/generated component code appears after a successful run/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/generated-component\.tsx/i)).toBeInTheDocument();
});

test("copies the exact generated source and shows copied feedback", async () => {
  const user = userEvent.setup();
  const writeText = vi.fn().mockResolvedValue(undefined);

  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });

  const source = `export function Demo() {\n  return <button>Demo</button>;\n}`;

  render(<GenerationCodePanel code={source} />);

  await user.click(screen.getByRole("button", { name: /copy generated code/i }));

  expect(writeText).toHaveBeenCalledWith(source);
  expect(
    screen.getByRole("button", { name: /copied generated code/i }),
  ).toBeInTheDocument();
});

test("renders known TSX tokens with token metadata while preserving text", () => {
  render(
    <GenerationCodePanel
      code={`export function Demo() {\n  return <button type="button">Demo</button>;\n}`}
    />,
  );

  expect(screen.getByText("export")).toHaveAttribute("data-token-type", "keyword");
  screen.getAllByText("button").forEach((token) => {
    expect(token).toHaveAttribute("data-token-type", "tag");
  });
  expect(screen.getByText("type")).toHaveAttribute("data-token-type", "attribute");
});
