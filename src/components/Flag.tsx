import type { ComponentType } from "react";
import {
  IT,
  FR,
  PT,
  DE,
  AR,
  CL,
  ZA,
  US,
  ES,
  AT,
  GE,
  NZ,
} from "country-flag-icons/react/3x2";

// Team slug -> SVG flag component (ISO 3166-1 alpha-2). Rendered as real
// images so flags look identical on every OS, not OS emoji fonts.
type FlagProps = { title?: string; className?: string };

const FLAGS: Record<string, ComponentType<FlagProps>> = {
  italy: IT,
  france: FR,
  portugal: PT,
  germany: DE,
  argentina: AR,
  chile: CL,
  "south-africa": ZA,
  usa: US,
  spain: ES,
  austria: AT,
  georgia: GE,
  "new-zealand": NZ,
};

export default function Flag({
  slug,
  className = "",
  title,
}: {
  slug: string;
  className?: string;
  title?: string;
}) {
  const C = FLAGS[slug];
  if (!C) return null;
  return (
    <C
      title={title}
      className={`inline-block h-auto rounded-[2px] overflow-hidden align-middle ${className}`}
    />
  );
}
