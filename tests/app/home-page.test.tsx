import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

test("homepage shows the product headline and open-access builder CTA", () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", {
      name: /generate design system components from selected ui skills/i,
    }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("link", { name: /open workspace/i }),
  ).toHaveAttribute("href", "/workspace");

  expect(screen.getByText(/open access is live right now/i)).toBeInTheDocument();

  expect(screen.getByText(/simple workflow/i)).toBeInTheDocument();
});
