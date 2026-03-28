import { expect, test, vi } from "vitest";

import { handleGenerateRequest } from "@/lib/generation/handle-generate-request";

test("guest generation requests succeed without a user session", async () => {
  const getQuotaStatus = vi.fn(async () => ({
    allowed: false,
    remaining: 0,
    limit: 5,
    usedToday: 5,
    actorId: "guest_123",
    isUnlimited: false,
  }));
  const recordUsage = vi.fn(async () => undefined);

  const response = await handleGenerateRequest(
    {
      componentType: "Button",
      skillIds: ["skill_1"],
    },
    {
      resolveActor: async () => ({
        actor: {
          type: "guest",
          guestId: "guest_123",
          isNewGuest: false,
        },
        cookieToSet: null,
      }),
      getQuotaStatus,
      getSkills: async () => [
        {
          id: "skill_1",
          name: "Editorial Skill",
          styleCues: ["crisp", "quiet"],
        },
      ],
      recordUsage,
      generateComponent: async () => ({
        componentName: "Button",
        code: 'export function Button(){ return <button>OK</button>; }',
        previewMarkup: "<button>OK</button>",
        rationale: "Uses selected skill.",
      }),
      saveGeneration: async () => ({
        id: "generation_123",
      }),
    },
  );

  expect(response.status).toBe(200);
  expect(getQuotaStatus).not.toHaveBeenCalled();
  expect(recordUsage).not.toHaveBeenCalled();
});

test("generation requests reject previews that rely on Tailwind classes in the isolated preview runtime", async () => {
  const saveGeneration = vi.fn(async () => ({
    id: "generation_123",
  }));

  const response = await handleGenerateRequest(
    {
      componentType: "Button",
      skillIds: ["skill_1"],
    },
    {
      resolveActor: async () => ({
        actor: {
          type: "guest",
          guestId: "guest_123",
          isNewGuest: false,
        },
        cookieToSet: null,
      }),
      getQuotaStatus: async () => ({
        allowed: true,
        remaining: null,
        limit: null,
        usedToday: 0,
        actorId: "guest_123",
        isUnlimited: true,
      }),
      getSkills: async () => [
        {
          id: "skill_1",
          name: "Editorial Skill",
          styleCues: ["crisp", "quiet"],
        },
      ],
      recordUsage: async () => undefined,
      generateComponent: async () => ({
        componentName: "Button",
        code: [
          "export default function Button() {",
          "  return (",
          "    <button className='rounded-full bg-black px-4 py-2 text-white'>",
          "      Press",
          "    </button>",
          "  );",
          "}",
        ].join("\n"),
        previewMarkup:
          "<button class=\"rounded-full bg-black px-4 py-2 text-white\">Press</button>",
        rationale: "Uses selected skill.",
      }),
      saveGeneration,
    },
  );

  expect(response.status).toBe(422);
  expect(await response.json()).toEqual(
    expect.objectContaining({
      error: "Generated preview failed validation.",
      details: expect.arrayContaining([
        expect.stringContaining("self-contained"),
      ]),
    }),
  );
  expect(saveGeneration).not.toHaveBeenCalled();
});

test("generation requests log the rejected code when code validation fails", async () => {
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

  const response = await handleGenerateRequest(
    {
      componentType: "Button",
      skillIds: ["skill_1"],
    },
    {
      resolveActor: async () => ({
        actor: {
          type: "guest",
          guestId: "guest_123",
          isNewGuest: false,
        },
        cookieToSet: null,
      }),
      getQuotaStatus: async () => ({
        allowed: true,
        remaining: null,
        limit: null,
        usedToday: 0,
        actorId: "guest_123",
        isUnlimited: true,
      }),
      getSkills: async () => [
        {
          id: "skill_1",
          name: "Editorial Skill",
          styleCues: ["crisp", "quiet"],
        },
      ],
      recordUsage: async () => undefined,
      generateComponent: async () => ({
        componentName: "Button",
        code: [
          'import { ArrowRight } from "lucide-react";',
          "",
          "export default function Button() {",
          "  return <button>Press</button>;",
          "}",
        ].join("\n"),
        previewMarkup: "<button>Press</button>",
        rationale: "Uses selected skill.",
      }),
      saveGeneration: async () => ({
        id: "generation_123",
      }),
    },
  );

  expect(response.status).toBe(422);
  expect(warnSpy).toHaveBeenCalledWith(
    "Generated code failed validation.",
    expect.objectContaining({
      errors: expect.arrayContaining([
        expect.stringContaining("Disallowed pattern"),
      ]),
      code: expect.stringContaining('from "lucide-react"'),
      componentType: "Button",
      skillIds: ["skill_1"],
      actorType: "guest",
    }),
  );

  warnSpy.mockRestore();
});

test("generation requests accept code that imports React", async () => {
  const saveGeneration = vi.fn(async () => ({
    id: "generation_123",
  }));

  const response = await handleGenerateRequest(
    {
      componentType: "Button",
      skillIds: ["skill_1"],
    },
    {
      resolveActor: async () => ({
        actor: {
          type: "guest",
          guestId: "guest_123",
          isNewGuest: false,
        },
        cookieToSet: null,
      }),
      getQuotaStatus: async () => ({
        allowed: true,
        remaining: null,
        limit: null,
        usedToday: 0,
        actorId: "guest_123",
        isUnlimited: true,
      }),
      getSkills: async () => [
        {
          id: "skill_1",
          name: "Editorial Skill",
          styleCues: ["crisp", "quiet"],
        },
      ],
      recordUsage: async () => undefined,
      generateComponent: async () => ({
        componentName: "Button",
        code: [
          "import * as React from 'react';",
          "",
          "type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;",
          "",
          "export default function Button(props: ButtonProps) {",
          "  return <button {...props}>Press</button>;",
          "}",
        ].join("\n"),
        previewMarkup: "<button>Press</button>",
        rationale: "Uses selected skill.",
      }),
      saveGeneration,
    },
  );

  expect(response.status).toBe(200);
  expect(saveGeneration).toHaveBeenCalledOnce();
});
