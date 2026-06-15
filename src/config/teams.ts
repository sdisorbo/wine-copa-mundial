export type Group = "A" | "B" | "C";

export interface Team {
  slug: string;
  name: string;
  flag: string;
  group: Group;
  pin: string;
}

// NOTE: Change all PINs before the event.
export const TEAMS: Team[] = [
  { slug: "italy", name: "Italy", flag: "🇮🇹", group: "A", pin: "1234" },
  { slug: "france", name: "France", flag: "🇫🇷", group: "A", pin: "2345" },
  { slug: "portugal", name: "Portugal", flag: "🇵🇹", group: "A", pin: "3456" },
  { slug: "germany", name: "Germany", flag: "🇩🇪", group: "A", pin: "4567" },
  { slug: "argentina", name: "Argentina", flag: "🇦🇷", group: "B", pin: "5678" },
  { slug: "chile", name: "Chile", flag: "🇨🇱", group: "B", pin: "6789" },
  { slug: "south-africa", name: "South Africa", flag: "🇿🇦", group: "B", pin: "7890" },
  { slug: "california", name: "California", flag: "🇺🇸", group: "B", pin: "8901" },
  { slug: "spain", name: "Spain", flag: "🇪🇸", group: "C", pin: "9012" },
  { slug: "austria", name: "Austria", flag: "🇦🇹", group: "C", pin: "0123" },
  { slug: "georgia", name: "Georgia", flag: "🇬🇪", group: "C", pin: "1357" },
  { slug: "washington", name: "Washington State", flag: "🇺🇸", group: "C", pin: "2468" },
];

// NOTE: Change before the event.
export const ADMIN_PIN = "0000";

export const GROUP_NAMES: Record<Group, string> = {
  A: "Old World Classics",
  B: "New World Power",
  C: "Iberian & Alpine",
};

export const GROUPS: Group[] = ["A", "B", "C"];

export function getTeam(slug: string): Team | undefined {
  return TEAMS.find((t) => t.slug === slug);
}

export function teamsInGroup(group: Group): Team[] {
  return TEAMS.filter((t) => t.group === group);
}
