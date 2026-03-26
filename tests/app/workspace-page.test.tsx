import { render, screen } from "@testing-library/react";
import WorkspacePage from "@/app/(app)/workspace/page";

test("workspace page shows the generation builder heading", () => {
  render(<WorkspacePage />);

  expect(
    screen.getByRole("heading", { name: /build a component/i }),
  ).toBeInTheDocument();
});
