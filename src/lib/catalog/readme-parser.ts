export function summarizeReadme(readmeText: string, maxLength = 240) {
  const flattened = readmeText
    .replace(/[`#>*_\-\[\]\(\)]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (flattened.length <= maxLength) {
    return flattened;
  }

  return `${flattened.slice(0, maxLength).trim()}...`;
}
