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

export type ReadmeSkillEntry = {
  name: string;
  description: string | null;
};

function normalizeMarkdownCell(cell: string) {
  return cell
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isMarkdownTableDivider(cell: string) {
  return /^[\s:-]+$/.test(cell);
}

export function extractSkillEntriesFromReadme(readmeText: string) {
  const entries: ReadmeSkillEntry[] = [];

  for (const line of readmeText.split("\n")) {
    const trimmedLine = line.trim();

    if (!trimmedLine.startsWith("|")) {
      continue;
    }

    const cells = trimmedLine
      .split("|")
      .slice(1, -1)
      .map(normalizeMarkdownCell);

    if (
      cells.length < 2 ||
      isMarkdownTableDivider(cells[0]) ||
      cells[0].toLowerCase() === "skill"
    ) {
      continue;
    }

    entries.push({
      name: cells[0],
      description: cells[1] || null,
    });
  }

  return entries;
}

export function extractSkillOrderFromReadme(readmeText: string) {
  return extractSkillEntriesFromReadme(readmeText).map((entry) =>
    entry.name.toLowerCase(),
  );
}

export function extractSkillDescriptionFromReadme(
  readmeText: string,
  skillName: string,
) {
  const normalizedSkillName = skillName.trim().toLowerCase();

  return (
    extractSkillEntriesFromReadme(readmeText).find(
      (entry) => entry.name.toLowerCase() === normalizedSkillName,
    )?.description ?? null
  );
}
