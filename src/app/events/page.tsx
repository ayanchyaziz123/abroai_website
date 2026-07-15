import Link from "next/link";
import type { Metadata } from "next";
import { fetchServer } from "@/lib/api-server";
import { getCatalogMeta } from "@/lib/catalog";
import ListingCard from "@/components/listings/ListingCard";
import CategoryFilterBar from "@/components/listings/CategoryFilterBar";
import SearchBar from "@/components/listings/SearchBar";
import type { EventListing, Paginated } from "@/types";

export const metadata: Metadata = { title: "Events" };

const ACCENT = "#E85555";

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams({ upcoming: "true" });
  if (sp.search) params.set("search", sp.search);
  if (sp.category) params.set("category", sp.category);

  const [meta, events] = await Promise.all([
    getCatalogMeta("event"),
    fetchServer<Paginated<EventListing>>(`events/?${params.toString()}`),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-navy">Events</h1>
        <p className="text-sm text-navy/55">Meetups, legal aid & community events near you.</p>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchBar placeholder="Search events, organizers…" />
        </div>
        <Link
          href="/events/new"
          className="inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          + Create an event
        </Link>
      </div>

      <div className="mt-4">
        <CategoryFilterBar categories={meta.categories} accent={ACCENT} />
      </div>

      {events.results.length === 0 ? (
        <div className="mt-16 text-center text-sm text-navy/45">No upcoming events found.</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.results.map((ev) => (
            <ListingCard
              key={ev.id}
              href={`/events/${ev.id}`}
              title={ev.title}
              subtitle={ev.is_free ? "Free" : ev.price ? `$${ev.price}` : "Paid"}
              location={ev.location}
              imageUrl={ev.image_url}
              accent={ACCENT}
              emoji="🎉"
              meta={formatEventDate(ev.date)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
