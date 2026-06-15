"use client";

import { useSession } from "@/lib/storage";

/** Renders children only when the current session is an admin. */
export default function AdminGate({ children }: { children: React.ReactNode }) {
  const { session, mounted } = useSession();
  if (!mounted || session?.role !== "admin") return null;
  return <>{children}</>;
}
