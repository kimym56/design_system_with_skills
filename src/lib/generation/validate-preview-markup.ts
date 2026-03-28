const tailwindLikeUtilityPattern =
  /["'`][^"'`]*\b(?:bg-|text-|px-|py-|pt-|pb-|pl-|pr-|p-|mx-|my-|mt-|mb-|ml-|mr-|m-|rounded|border|shadow|flex|grid|gap-|items-|justify-|w-|h-|min-|max-|font-|tracking-|leading-|hover:|focus:|focus-visible:|disabled:|ring-)[^"'`]*["'`]/;

export function validatePreviewMarkup(code: string, previewMarkup: string) {
  const errors: string[] = [];
  const codeUsesTailwindLikeUtilities = tailwindLikeUtilityPattern.test(code);
  const previewHasSelfContainedStyles =
    /\bstyle\s*=/.test(previewMarkup) || /<style[\s>]/i.test(previewMarkup);

  if (codeUsesTailwindLikeUtilities && !previewHasSelfContainedStyles) {
    errors.push(
      "Preview markup must be self-contained for the isolated preview runtime. Use inline styles or a <style> block instead of relying on Tailwind classes alone.",
    );
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}
