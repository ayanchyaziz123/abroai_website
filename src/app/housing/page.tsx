import Link from "next/link";
import type { Metadata } from "next";
import { fetchServer } from "@/lib/api-server";
import { getCatalogMeta } from "@/lib/catalog";
import ListingCard from "@/components/listings/ListingCard";
import CategoryFilterBar from "@/components/listings/CategoryFilterBar";
import SearchBar from "@/components/listings/SearchBar";
import type { HousingListing, Paginated } from "@/types";

export const metadata: Metadata = { title: "Housing" };

const ACCENT = "#F4A227";

export default async function HousingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.search) params.set("search", sp.search);
  if (sp.category) params.set("category", sp.category);
  if (sp.sort) params.set("sort", sp.sort);

  const [meta, listings] = await Promise.all([
    getCatalogMeta("housing"),
    fetchServer<Paginated<HousingListing>>(`housing/?${params.toString()}`),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-navy">Housing</h1>
        <p className="text-sm text-navy/55">Rooms, apartments, and sublets from your community.</p>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchBar placeholder="Search housing, neighborhoods…" />
        </div>
        <Link
          href="/housing/new"
          className="inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          + List a home
        </Link>
      </div>

      <div className="mt-4">
        <CategoryFilterBar categories={meta.categories} accent={ACCENT} />
      </div>

      {listings.results.length === 0 ? (
        <div className="mt-16 text-center text-sm text-navy/45">No listings found. Try a different search or category.</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.results.map((l) => (
            <ListingCard
              key={l.id}
              href={`/housing/${l.id}`}
              title={l.title}
              subtitle={l.price ? `$${l.price}/mo` : null}
              location={l.location}
              imageUrl={l.image_url}
              badge={l.is_featured ? "Featured" : null}
              accent={ACCENT}
              emoji="🏠"
              meta={l.bedrooms != null ? `${l.bedrooms === 0 ? "Studio" : `${l.bedrooms} bd`}` : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
