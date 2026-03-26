import { expect, test } from "vitest";

import { validateGeneratedCode } from "@/lib/generation/validate-generated-code";

test("generated code rejects fetch and external imports", () => {
  const result = validateGeneratedCode(
    "import axios from 'axios'; export function Demo(){ fetch('/x'); return <div />; }",
  );

  expect(result.ok).toBe(false);
});

test("generated code accepts a simple React component with Tailwind classes", () => {
  const result = validateGeneratedCode(
    "export default function Demo(){ return <button className='rounded-full bg-black px-4 py-2 text-white'>Press</button>; }",
  );

  expect(result.ok).toBe(true);
});
