import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { CreateGenerationForm } from "@/components/create-generation-form";

test("submits the selected component type in the generation request", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
    if (!init) {
      return Response.json({
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
      });
    }

    return Response.json({
      generation: {
        resultCode: `export function Demo() {\n  return <button>Demo</button>;\n}`,
        previewPayload: {
          html: "<button>Demo</button>",
        },
        rationale: "Approved skills favored a compact input pattern.",
      },
      quota: {
        remaining: 4,
        usedToday: 1,
        limit: 5,
      },
    });
  }) as unknown as typeof fetch;

  vi.stubGlobal("fetch", fetchMock);

  render(<CreateGenerationForm />);

  await screen.findByRole("button", { name: /select skills/i });

  await user.click(
    screen.getByRole("button", { name: /component type button/i }),
  );
  await user.click(screen.getByText(/^input$/i));

  await user.click(screen.getByRole("button", { name: /select skills/i }));
  await user.click(
    await screen.findByText(/pbakaus\/impeccable\/impeccable/i),
  );

  await user.click(screen.getByRole("button", { name: /generate run/i }));

  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

  const [, requestInit] = fetchMock.mock.calls[1] as [
    RequestInfo | URL,
    RequestInit,
  ];

  expect(requestInit.method).toBe("POST");
  expect(JSON.parse(requestInit.body as string)).toMatchObject({
    componentType: "Input",
    skillIds: ["skill-1"],
  });
  expect(screen.queryByText(/generation rationale/i)).not.toBeInTheDocument();
  expect(
    screen.queryByText(/approved skills favored a compact input pattern\./i),
  ).not.toBeInTheDocument();

  vi.unstubAllGlobals();
});

test("shows generation validation details when the server rejects the artifact", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
    if (!init) {
      return Response.json({
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
          remaining: null,
          usedToday: 0,
          limit: null,
          isUnlimited: true,
        },
      });
    }

    return Response.json(
      {
        error: "Generated code failed validation.",
        details: [
          "Disallowed pattern: /\\bfrom\\s+[\"'][^\"']+[\"']/",
          "Component must export a function component.",
        ],
      },
      { status: 422 },
    );
  }) as unknown as typeof fetch;

  vi.stubGlobal("fetch", fetchMock);

  render(<CreateGenerationForm />);

  await screen.findByRole("button", { name: /select skills/i });

  await user.click(screen.getByRole("button", { name: /select skills/i }));
  await user.click(
    await screen.findByText(/pbakaus\/impeccable\/impeccable/i),
  );
  await user.click(screen.getByRole("button", { name: /generate run/i }));

  expect(
    await screen.findByText(/generated code failed validation\./i),
  ).toBeInTheDocument();
  expect(
    screen.getByText('Disallowed pattern: /\\bfrom\\s+["\'][^"\']+["\']/'),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/component must export a function component\./i),
  ).toBeInTheDocument();

  vi.unstubAllGlobals();
});

test("shows a loading placeholder while a generation request is pending", async () => {
  const user = userEvent.setup();
  const fetchMock = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
    if (!init) {
      return Promise.resolve(
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
            remaining: null,
            usedToday: 0,
            limit: null,
            isUnlimited: true,
          },
        }),
      );
    }

    return new Promise<Response>(() => {});
  }) as unknown as typeof fetch;

  vi.stubGlobal("fetch", fetchMock);

  render(<CreateGenerationForm />);

  await screen.findByRole("button", { name: /select skills/i });

  await user.click(
    screen.getByRole("button", { name: /component type button/i }),
  );
  await user.click(screen.getByText(/^input$/i));

  await user.click(screen.getByRole("button", { name: /select skills/i }));
  await user.click(
    await screen.findByText(/pbakaus\/impeccable\/impeccable/i),
  );
  await user.click(screen.getByRole("button", { name: /generate run/i }));

  const status = await screen.findByRole("status");

  expect(status.children).toHaveLength(1);
  expect(await screen.findByText(/input silhouette/i)).toBeInTheDocument();
  expect(screen.queryByText(/^running$/i)).not.toBeInTheDocument();
  expect(
    screen.queryByText(/generating input component run/i),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(/assembling preview and code surfaces for this request\./i),
  ).not.toBeInTheDocument();

  vi.unstubAllGlobals();
});
