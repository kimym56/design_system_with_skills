import { render, screen } from "@testing-library/react";
import AppLayout from "@/app/(app)/layout";

test("authenticated app layout renders navigation labels", () => {
  render(
    <AppLayout>
      <div>child</div>
    </AppLayout>,
  );

  expect(screen.getByRole("link", { name: /workspace/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /history/i })).toBeInTheDocument();
});
