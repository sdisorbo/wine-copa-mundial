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
