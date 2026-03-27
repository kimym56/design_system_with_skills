import { render, screen } from "@testing-library/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

test("button renders children and remains clickable", () => {
  render(<Button>Generate component</Button>);

  expect(
    screen.getByRole("button", { name: /generate component/i }),
  ).toBeInTheDocument();
});

test("button supports asChild links", () => {
  render(
    <Button asChild>
      <Link href="/workspace">Open workspace</Link>
    </Button>,
  );

  expect(screen.getByRole("link", { name: /open workspace/i })).toBeInTheDocument();
});

test("button applies variant and disabled state", () => {
  render(
    <Button variant="secondary" disabled>
      Secondary action
    </Button>,
  );

  const button = screen.getByRole("button", { name: /secondary action/i });
  expect(button).toBeDisabled();
  expect(button.className).toMatch(/bg-muted/);
});

test("button keeps the outline variant for secondary product actions", () => {
  render(<Button variant="outline">Open history</Button>);

  const button = screen.getByRole("button", { name: /open history/i });
  expect(button.className).toMatch(/border/);
});
