export type CatalogRules = {
  minStars: number;
  requiredTopics: string[];
  readmeKeywords: string[];
};

export type CatalogCandidate = {
  isPrivate: boolean;
  stars: number;
  topics: string[];
  hasReadme: boolean;
  readmeText: string;
};

export const DEFAULT_RULES: CatalogRules = {
  minStars: 1000,
  requiredTopics: ["ui", "ux", "design-system", "frontend"],
  readmeKeywords: ["design system", "component", "ui", "ux"],
};

function normalize(values: string[]) {
  return values.map((value) => value.trim().toLowerCase()).filter(Boolean);
}

export function qualifiesForAutoPublish(
  candidate: CatalogCandidate,
  rules: CatalogRules,
) {
  if (candidate.isPrivate || !candidate.hasReadme || candidate.stars < rules.minStars) {
    return false;
  }

  const topics = normalize(candidate.topics);
  const readme = candidate.readmeText.toLowerCase();
  const hasTopicMatch = normalize(rules.requiredTopics).some((topic) =>
    topics.includes(topic),
  );
  const hasKeywordMatch = normalize(rules.readmeKeywords).some((keyword) =>
    readme.includes(keyword),
  );

  return hasTopicMatch || hasKeywordMatch;
}
