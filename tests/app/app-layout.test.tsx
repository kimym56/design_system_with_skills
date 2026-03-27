import { render, screen } from "@testing-library/react";
import AppLayout from "@/app/(app)/layout";

test("authenticated app layout renders navigation labels", () => {
  render(
    <AppLayout>
      <div>child</div>
    </AppLayout>,
  );

  expect(
    screen.getAllByRole("link", { name: /workspace/i }).length,
  ).toBeGreaterThan(0);
  expect(screen.getByRole("link", { name: /history/i })).toBeInTheDocument();
  expect(screen.getByText(/approved component pipeline/i)).toBeInTheDocument();
});
