import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, vi } from "vitest";

import GenerationDetailPage from "@/app/(app)/(generation-history)/history/[generationId]/page";

const { requireUserSessionMock } = vi.hoisted(() => ({
  requireUserSessionMock: vi.fn(),
}));

vi.mock("@/lib/auth/guards", () => ({
  requireUserSession: requireUserSessionMock,
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ generationId: "demo-generation" }),
}));

const renderGenerationDetailPage =
  GenerationDetailPage as unknown as (props: {
    params: Promise<{ generationId: string }>;
  }) => Promise<React.ReactNode> | React.ReactNode;

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

test("generation detail page shows editorial loading copy before data arrives", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise(() => {})) as unknown as typeof fetch,
  );

  render(
    await renderGenerationDetailPage({
      params: Promise.resolve({ generationId: "demo-generation" }),
    }),
  );

  expect(requireUserSessionMock).toHaveBeenCalledWith(
    "/history/demo-generation",
  );

  expect(screen.getByText(/loading saved result/i)).toBeInTheDocument();

  vi.unstubAllGlobals();
});

test("generation detail page shows the saved run summary", async () => {
  const user = userEvent.setup();

  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({
        generation: {
          id: "demo-generation",
          componentType: "Button",
          rationale: "Approved skills favored a compact primary action.",
          resultCode: "export function Demo() { return <button />; }",
          createdAt: "2026-03-27T10:00:00.000Z",
          model: "gpt-5.4",
          previewPayload: {
            html: "<button>Demo</button>",
          },
          selectedSkills: [
            {
              skill: {
                id: "s1",
                name: "minimalist-ui",
              },
            },
          ],
        },
      })) as unknown as typeof fetch,
  );

  render(
    await renderGenerationDetailPage({
      params: Promise.resolve({ generationId: "demo-generation" }),
    }),
  );

  expect(requireUserSessionMock).toHaveBeenCalledWith(
    "/history/demo-generation",
  );

  expect(
    await screen.findByRole("heading", { name: /button/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /button/i }).closest("main")?.className,
  ).toMatch(/px-4/);

  const summaryHeading = await screen.findByRole("heading", {
    name: /saved run summary/i,
  });

  expect(summaryHeading.parentElement?.className).toMatch(/border-b/);
  expect(summaryHeading.parentElement?.className).toMatch(/sm:p-6/);
  expect(
    summaryHeading.closest("[class*='rounded-\\[16px\\]']")?.className,
  ).toMatch(/overflow-hidden/);
  expect(
    screen.getByRole("heading", { name: /generated result/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /^preview$/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(
    screen.getByRole("button", { name: /open large preview/i }),
  ).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /^code$/i }));

  expect(screen.getByText("export")).toHaveAttribute("data-token-type", "keyword");
  expect(
    screen.getByRole("button", { name: /copy generated code/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/generated-component\.tsx/i)).toBeInTheDocument();

  vi.unstubAllGlobals();
});
