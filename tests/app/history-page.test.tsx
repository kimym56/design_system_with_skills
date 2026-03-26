import { render, screen } from "@testing-library/react";

import HistoryPage from "@/app/(app)/history/page";

test("history page shows a heading and empty-state copy", () => {
  render(<HistoryPage />);

  expect(
    screen.getByRole("heading", { name: /generation history/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/saved components reopen here/i)).toBeInTheDocument();
});
