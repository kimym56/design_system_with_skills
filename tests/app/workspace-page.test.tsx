import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, vi } from "vitest";

import * as workspacePageModule from "@/app/(app)/(generation-history)/workspace/page";
import WorkspacePage from "@/app/(app)/(generation-history)/workspace/page";

const { requireUserSessionMock } = vi.hoisted(() => ({
  requireUserSessionMock: vi.fn(),
}));

vi.mock("@/lib/auth/guards", () => ({
  requireUserSession: requireUserSessionMock,
}));

beforeEach(() => {
  requireUserSessionMock.mockReset();
  requireUserSessionMock.mockResolvedValue({
    user: {
      id: "user-1",
      email: "ymkim@example.com",
      name: "Yongmin Kim",
      image: null,
    },
  });
});

test("workspace page forces dynamic rendering to avoid stale prerendered form HTML", () => {
  expect(workspacePageModule.dynamic).toBe("force-dynamic");
});

test("workspace page shows the generation builder heading", async () => {
  const user = userEvent.setup();

  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        skills: [
          {
            id: "skill-1",
            name: "impeccable",
            title: "pbakaus/impeccable/impeccable",
            description: "Design language for sharper frontend output.",
            githubStars: 14143,
          },
        ],
        quota: {
          remaining: 5,
          usedToday: 0,
          limit: 5,
        },
      })) as unknown as typeof fetch,
  );

  render(await WorkspacePage());

  expect(requireUserSessionMock).toHaveBeenCalledWith("/workspace");

  expect(
    screen.getByRole("heading", { name: /run a component generation/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /run a component generation/i }).closest("main")
      ?.className,
  ).toMatch(/px-4/);
  expect(
    screen.getByText(
      /select a component, choose approved skills, and review the output before saving the run/i,
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /generation inputs/i }),
  ).toBeInTheDocument();
  expect(screen.queryByText(/approved catalog/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/curated inputs only/i)).not.toBeInTheDocument();
  expect(
    screen.queryByText(/primary and secondary call-to-action controls\./i),
  ).not.toBeInTheDocument();
  expect(screen.queryByText(/published catalog only\./i)).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /component type button/i }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("combobox", { name: /component type/i })).not.toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: /select skills/i }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(/pbakaus\/impeccable\/impeccable/i),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /generation inputs/i }).parentElement
      ?.className,
  ).toMatch(/sm:flex/);
  expect(
    screen
      .getByRole("heading", { name: /generation inputs/i })
      .closest("[class*='bg-white']")
      ?.className,
  ).toMatch(/rounded-t-\[15px\]/);
  expect(
    screen.getByRole("heading", { name: /generation inputs/i }).closest(".border-b"),
  ).not.toBeInTheDocument();

  await user.click(
    screen.getByRole("button", { name: /component type button/i }),
  );

  expect(
    screen.getByText(/single-line text fields for forms and search\./i),
  ).toBeInTheDocument();

  await user.click(screen.getByText(/^input$/i));

  expect(
    screen.getByRole("button", { name: /component type input/i }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText(/single-line text fields for forms and search\./i),
  ).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /select skills/i }));

  expect(
    await screen.findByText(/pbakaus\/impeccable\/impeccable/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/14\.1k stars/i)).toBeInTheDocument();
  expect(screen.queryByText(/14143 stars/i)).not.toBeInTheDocument();
  await user.click(screen.getByText(/pbakaus\/impeccable\/impeccable/i));
  expect(
    screen.getByRole("button", { name: /pbakaus\/impeccable\/impeccable/i }),
  ).toBeInTheDocument();
  expect(
    screen
      .getByRole("heading", { name: /generation inputs/i })
      .closest("[class*='rounded-[16px]']")
      ?.className,
  ).not.toMatch(/overflow-hidden/);
  expect(
    screen.getByRole("heading", { name: /generated result/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /^preview$/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.getByRole("button", { name: /^code$/i })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  expect(
    screen.getByRole("button", { name: /open large preview/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/generated preview appears here after a successful run/i),
  ).toBeInTheDocument();

  vi.unstubAllGlobals();
});
