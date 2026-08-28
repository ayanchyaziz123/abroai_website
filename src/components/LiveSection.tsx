"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import HomeRow from "./HomeRow";
import ListingCard, { ListingItem } from "./ListingCard";
import ProfessionalCard, { ProfessionalItem } from "./ProfessionalCard";
import { LISTING_TYPES } from "@/lib/listingTypes";

const AI_SUGGESTIONS = [
  "Jobs that sponsor visas",
  "Rooms near me under $900",
  "Do I need a lawyer for OPT?",
  "Sell my old furniture",
];

export default function LiveSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submitAsk(e?: FormEvent) {
    e?.preventDefault();
    // Same Groq-backed AI Assistant the app uses (/ai/chat/) — requires
    // login same as the app does, so signed-out visitors land on /login
    // first (RequireAuth on /ai) and come back here after.
    if (query.trim()) router.push(`/ai?q=${encodeURIComponent(query.trim())}`);
  }

  const jobCfg = LISTING_TYPES.find((t) => t.key === "job")!;
  const housingCfg = LISTING_TYPES.find((t) => t.key === "housing")!;
  const marketCfg = LISTING_TYPES.find((t) => t.key === "marketplace")!;

  return (
    <section className="bg-ground">
      <div className="mx-auto max-w-5xl px-6 py-8 sm:py-10">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-dim px-3.5 py-1.5 text-[12.5px] font-semibold text-accent">
            Live on Abrofy right now
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink text-balance">
            Not a mockup — real listings, real people
          </h2>
          <p className="mt-2 text-[15px] text-ink-dim">
            Everything below is pulled live from the same community the app runs on.
          </p>
        </div>

        <form
          onSubmit={submitAsk}
          className="mx-auto mt-5 flex max-w-xl items-center gap-2 rounded-full border border-line bg-surface p-1.5 pl-4 shadow-sm"
        >
          <span className="text-[15px]">✨</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about visas, jobs, housing, or anything…"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-faint"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
          >
            Search
          </button>
        </form>
        <div className="mx-auto mt-3 flex max-w-xl flex-wrap justify-center gap-2">
          {AI_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                router.push(`/ai?q=${encodeURIComponent(s)}`);
              }}
              className="rounded-full bg-surface-2 px-3.5 py-1.5 text-[12px] font-medium text-ink-dim transition hover:bg-accent-dim hover:text-accent"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-7">
          <HomeRow<ListingItem>
            title="Jobs"
            emoji="💼"
            endpoint="/jobs/"
            viewAllHref="/browse?type=job"
            renderItem={(item) => <ListingCard item={item} cfg={jobCfg} />}
          />
          <HomeRow<ListingItem>
            title="Housing"
            emoji="🏠"
            endpoint="/housing/"
            viewAllHref="/browse?type=housing"
            renderItem={(item) => <ListingCard item={item} cfg={housingCfg} />}
          />
          <HomeRow<ProfessionalItem>
            title="Lawyers"
            emoji="⚖️"
            endpoint="/professionals/?type=attorney"
            viewAllHref="/professionals?type=attorney"
            renderItem={(item) => <ProfessionalCard item={item} />}
          />
          <HomeRow<ProfessionalItem>
            title="Doctors"
            emoji="🩺"
            endpoint="/professionals/?type=doctor"
            viewAllHref="/professionals?type=doctor"
            renderItem={(item) => <ProfessionalCard item={item} />}
          />
          <HomeRow<ListingItem>
            title="Marketplace"
            emoji="🛍️"
            endpoint="/marketplace/"
            viewAllHref="/browse?type=marketplace"
            renderItem={(item) => <ListingCard item={item} cfg={marketCfg} />}
          />
        </div>
      </div>
    </section>
  );
}
