export const COUNTRY_COLORS: Record<string, string> = {
  italy: "#009246",
  france: "#002395",
  portugal: "#006600",
  germany: "#DD0000",
  argentina: "#74ACDF",
  chile: "#D52B1E",
  "south-africa": "#007A4D",
  usa: "#3C3B6E",
  spain: "#c60b1e",
  austria: "#ED2939",
  georgia: "#FF0000",
  "new-zealand": "#00247D",
};

export function countryColor(slug: string): string {
  return COUNTRY_COLORS[slug] ?? "#e9c46a";
}
