"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ListingCard, { ListingItem } from "@/components/ListingCard";
import { LISTING_TYPES, getListingType } from "@/lib/listingTypes";
import { api } from "@/lib/api";

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeKey = searchParams.get("type") || "job";
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const cfg = getListingType(typeKey) || LISTING_TYPES[0];

  const [items, setItems] = useState<ListingItem[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setItems(null);
    setError("");
    api(cfg.apiBase, { auth: false })
      .then((data) => {
        if (cancelled) return;
        const results = (data as { results?: ListingItem[] })?.results ?? (data as ListingItem[]);
        setItems(Array.isArray(results) ? results : []);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load listings. Please try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [cfg.apiBase]);

  // Client-side filter over the fetched page — the AI search box and
  // suggestion chips on the homepage hand off here rather than to a real
  // conversational assistant (that lives in the app), so this is a plain
  // substring match over title, not a semantic search.
  const filtered =
    items && q
      ? items.filter((it) => it.title?.toLowerCase().includes(q) || it.company?.toLowerCase().includes(q))
      : items;

  return (
    <div className="min-h-full bg-ground">
      <Nav />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-ink">Browse</h1>
        <p className="mt-2 text-[14px] text-ink-dim">
          Real listings from the Abrofy community — the same ones in the app.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {LISTING_TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => router.push(`/browse?type=${t.key}`)}
              className="rounded-full px-4 py-2 text-[13px] font-medium transition"
              style={
                t.key === cfg.key
                  ? { backgroundColor: t.accent, color: "#fff" }
                  : { backgroundColor: "var(--surface-2)", color: "var(--ink-dim)" }
              }
            >
              {t.labelPlural}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {error && <p className="text-[14px] text-red-600">{error}</p>}

          {!error && items === null && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-surface-2" />
              ))}
            </div>
          )}

          {!error && filtered !== null && filtered.length === 0 && (
            <p className="py-16 text-center text-[14px] text-ink-faint">
              {q ? `Nothing matching "${q}" right now.` : `No ${cfg.labelPlural.toLowerCase()} yet. Be the first to post one.`}
            </p>
          )}

          {!error && filtered !== null && filtered.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((item) => (
                <ListingCard key={item.id} item={item} cfg={cfg} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={null}>
      <BrowseContent />
    </Suspense>
  );
}
