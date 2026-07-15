import Link from "next/link";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { fetchServer } from "@/lib/api-server";
import type { JobListing, HousingListing, MarketplaceListing, EventListing, Paginated } from "@/types";

export const metadata: Metadata = { title: "My listings" };

const TYPE_META = {
  job: { label: "Job", accent: "#3B8BF7", emoji: "💼" },
  housing: { label: "Housing", accent: "#F4A227", emoji: "🏠" },
  marketplace: { label: "Marketplace", accent: "#28D99E", emoji: "🛒" },
  event: { label: "Event", accent: "#E85555", emoji: "🎉" },
} as const;

export default async function MyListingsPage() {
  const user = await requireUser("/account/listings");

  const [jobs, housing, marketplace, events] = await Promise.all([
    fetchServer<Paginated<JobListing>>("jobs/"),
    fetchServer<Paginated<HousingListing>>("housing/"),
    fetchServer<Paginated<MarketplaceListing>>("marketplace/"),
    fetchServer<Paginated<EventListing>>("events/?upcoming=false"),
  ]);

  const rows = [
    ...jobs.results
      .filter((j) => j.poster_id === user.id)
      .map((j) => ({ type: "job" as const, id: j.id, title: j.title, sub: j.company, href: `/jobs/${j.id}` })),
    ...housing.results
      .filter((h) => h.poster_id === user.id)
      .map((h) => ({ type: "housing" as const, id: h.id, title: h.title, sub: h.price ? `$${h.price}/mo` : "", href: `/housing/${h.id}` })),
    ...marketplace.results
      .filter((m) => m.poster_id === user.id)
      .map((m) => ({ type: "marketplace" as const, id: m.id, title: m.title, sub: m.price ? `$${m.price}` : "Free", href: `/marketplace/${m.id}` })),
    ...events.results
      .filter((e) => e.posted_by_id === user.id)
      .map((e) => ({ type: "event" as const, id: e.id, title: e.title, sub: new Date(e.date).toLocaleDateString(), href: `/events/${e.id}` })),
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-navy">My listings</h1>
        <Link href="/account" className="text-sm font-semibold text-brand-blue hover:underline">
          ← Back to account
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="mt-16 text-center text-sm text-navy/45">
          You haven&apos;t posted anything yet.{" "}
          <Link href="/jobs/new" className="font-semibold text-brand-blue hover:underline">
            Post your first listing
          </Link>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5 bg-white card-shadow">
          {rows.map((row) => {
            const t = TYPE_META[row.type];
            return (
              <Link key={`${row.type}-${row.id}`} href={row.href} className="flex items-center gap-4 p-4 transition hover:bg-black/[0.02]">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                  style={{ backgroundColor: `${t.accent}18` }}
                >
                  {t.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-navy">{row.title}</p>
                  <p className="truncate text-xs text-navy/50">{row.sub}</p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase"
                  style={{ backgroundColor: `${t.accent}18`, color: t.accent }}
                >
                  {t.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
