// Tournament imagery. Files live in /public/images.

export const HERO_IMAGE = "/images/pamplona.jpg";
export const BREAK_IMAGE = "/images/new-zealand.jpeg";

// Per-team backdrop, keyed by team slug. Teams without an entry fall back
// to a solid country-color treatment on their profile.
export const TEAM_IMAGES: Record<string, string> = {
  italy: "/images/tuscany.jpg",
  france: "/images/burgundy.webp",
  portugal: "/images/portugal.webp",
  argentina: "/images/argentina.jpg",
  chile: "/images/chile.jpg",
  georgia: "/images/georgia.jpeg",
  spain: "/images/pamplona.jpg",
};

export function teamImage(slug: string): string | undefined {
  return TEAM_IMAGES[slug];
}
