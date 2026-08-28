"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProfessionalCard, { ProfessionalItem } from "@/components/ProfessionalCard";
import { api } from "@/lib/api";

const TABS: { key: "attorney" | "doctor"; label: string }[] = [
  { key: "attorney", label: "Lawyers" },
  { key: "doctor", label: "Doctors" },
];

function ProfessionalsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = (searchParams.get("type") as "attorney" | "doctor") || "attorney";

  const [items, setItems] = useState<ProfessionalItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setItems(null);
    api(`/professionals/?type=${type}`, { auth: false })
      .then((data) => {
        if (cancelled) return;
        const results = (data as { results?: ProfessionalItem[] })?.results ?? [];
        setItems(results);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [type]);

  return (
    <div className="min-h-full bg-ground">
      <Nav />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-ink">Professionals</h1>
        <p className="mt-2 text-[14px] text-ink-dim">Verified lawyers and doctors, vetted by Abrofy.</p>

        <div className="mt-8 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => router.push(`/professionals?type=${t.key}`)}
              className="rounded-full px-4 py-2 text-[13px] font-medium transition"
              style={
                t.key === type
                  ? { backgroundColor: "var(--accent)", color: "#fff" }
                  : { backgroundColor: "var(--surface-2)", color: "var(--ink-dim)" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {items === null && (
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square w-44 shrink-0 animate-pulse rounded-2xl bg-surface-2" />
              ))}
            </div>
          )}
          {items !== null && items.length === 0 && (
            <p className="py-16 text-center text-[14px] text-ink-faint">No {type === "attorney" ? "lawyers" : "doctors"} listed yet.</p>
          )}
          {items !== null && items.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {items.map((item) => (
                <ProfessionalCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={null}>
      <ProfessionalsContent />
    </Suspense>
  );
}
