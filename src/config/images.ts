// Tournament imagery. Files live in /public/images.

export const HERO_IMAGE = "/images/pamplona.jpg";
export const BREAK_IMAGE = "/images/tuscany.jpg";

// Per-team backdrop, keyed by team slug. Teams without an entry fall back
// to a solid country-color treatment on their profile.
export const TEAM_IMAGES: Record<string, string> = {
  italy: "/images/italy2.webp",
  france: "/images/france2.png",
  portugal: "/images/portugal.webp",
  germany: "/images/germany.jpg",
  argentina: "/images/argentina.jpg",
  chile: "/images/chile.jpg",
  "south-africa": "/images/south-africa.jpg",
  usa: "/images/usa.jpg",
  spain: "/images/pamplona.jpg",
  austria: "/images/austria.webp",
  georgia: "/images/georgia.jpeg",
  "new-zealand": "/images/new-zealand.webp",
};

export function teamImage(slug: string): string | undefined {
  return TEAM_IMAGES[slug];
}

// Wine-region map per team slug, shown on the team profile.
export const TEAM_MAPS: Record<string, string> = {
  italy: "/images/italy-map.jpg",
  france: "/images/france-map.jpg",
  portugal: "/images/portugal-map.jpeg",
  germany: "/images/germany-map.jpg",
  argentina: "/images/argentina-map.jpg",
  chile: "/images/chile-map.jpg",
  "south-africa": "/images/south-africa-map.jpg",
  usa: "/images/usa-map.jpg",
  spain: "/images/spain-map.jpg",
  austria: "/images/austria-map.jpg",
  georgia: "/images/georgia-map.jpg",
  "new-zealand": "/images/new-zealand-map.jpg",
};

export function teamMap(slug: string): string | undefined {
  return TEAM_MAPS[slug];
}
