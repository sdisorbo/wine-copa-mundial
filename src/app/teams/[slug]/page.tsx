import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TeamProfile from "@/components/TeamProfile";
import { TEAMS, getTeam } from "@/config/teams";

export function generateStaticParams() {
  return TEAMS.map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const team = getTeam(params.slug);
  return {
    title: team
      ? `${team.name} · Wine Copa Mundial`
      : "Team · Wine Copa Mundial",
  };
}

export default function TeamPage({ params }: { params: { slug: string } }) {
  if (!getTeam(params.slug)) notFound();
  return <TeamProfile slug={params.slug} />;
}
