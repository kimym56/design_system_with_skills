const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatGitHubStars(stars: number) {
  if (stars < 1000) {
    return stars.toString();
  }

  return compactNumberFormatter.format(stars).toLowerCase();
}
