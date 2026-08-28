"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading || user) return;
    const next = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [loading, user, router, pathname, searchParams]);

  if (loading || !user) {
    return <p className="mx-auto max-w-2xl px-6 py-16 text-[14px] text-ink-dim">Loading…</p>;
  }
  return <>{children}</>;
}
