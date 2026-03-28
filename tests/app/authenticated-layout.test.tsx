import { render, screen } from "@testing-library/react";

import AuthenticatedLayout from "@/app/(app)/layout";

test("authenticated app layout acts as a neutral wrapper without outer gutters", () => {
  const { container } = render(
    <AuthenticatedLayout>
      <div>child</div>
    </AuthenticatedLayout>,
  );

  expect(screen.getByText("child")).toBeInTheDocument();
  expect(container.firstChild).not.toHaveClass("px-3");
  expect(container.firstChild).not.toHaveClass("py-3");
  expect(container.firstChild).not.toHaveClass("sm:px-4");
  expect(container.firstChild).not.toHaveClass("sm:py-4");
});
