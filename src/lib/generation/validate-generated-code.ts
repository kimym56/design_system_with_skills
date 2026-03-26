const disallowedPatterns = [
  /\bfetch\s*\(/,
  /\baxios\b/,
  /\bfrom\s+["']axios["']/,
  /\bfrom\s+["'][^"./][^"']*["']/,
  /\bprocess\./,
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
  /\bdocument\./,
  /\bwindow\./,
  /\bnext\/server\b/,
  /\bfs\b/,
];

export function validateGeneratedCode(code: string) {
  const errors = disallowedPatterns
    .filter((pattern) => pattern.test(code))
    .map((pattern) => `Disallowed pattern: ${pattern}`);

  const hasExport =
    code.includes("export default function") || code.includes("export function");

  if (!hasExport) {
    errors.push("Component must export a function component.");
  }

  const hasJsx = code.includes("<") && code.includes(">");
  if (!hasJsx) {
    errors.push("Component must render JSX.");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}
