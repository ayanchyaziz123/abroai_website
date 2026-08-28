"use client";

import { Suspense, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import ListingForm from "@/components/ListingForm";
import { LISTING_TYPES } from "@/lib/listingTypes";

export default function PostPage() {
  const [typeKey, setTypeKey] = useState(LISTING_TYPES[0].key);
  const cfg = LISTING_TYPES.find((t) => t.key === typeKey)!;

  return (
    <div className="min-h-full bg-ground">
      <Nav />
      <main className="mx-auto max-w-lg px-6 py-12">
        <h1 className="font-display text-3xl font-semibold text-ink">Post a listing</h1>
        <p className="mt-2 text-[14px] text-ink-dim">Shared with the whole Abrofy community — web and app.</p>

        <Suspense fallback={null}>
          <RequireAuth>
            <div className="mt-6 flex flex-wrap gap-2">
              {LISTING_TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTypeKey(t.key)}
                  className="rounded-full px-4 py-2 text-[13px] font-medium transition"
                  style={
                    t.key === typeKey
                      ? { backgroundColor: t.accent, color: "#fff" }
                      : { backgroundColor: "var(--surface-2)", color: "var(--ink-dim)" }
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <ListingForm cfg={cfg} mode="create" key={typeKey} />
            </div>
          </RequireAuth>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
