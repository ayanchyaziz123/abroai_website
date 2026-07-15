import Link from "next/link";
import type { Metadata } from "next";
import { fetchServer } from "@/lib/api-server";
import { getCatalogMeta } from "@/lib/catalog";
import ListingCard from "@/components/listings/ListingCard";
import CategoryFilterBar from "@/components/listings/CategoryFilterBar";
import SearchBar from "@/components/listings/SearchBar";
import type { MarketplaceListing, Paginated } from "@/types";

export const metadata: Metadata = { title: "Marketplace" };

const ACCENT = "#28D99E";

export default async function MarketplacePage({
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
    getCatalogMeta("marketplace"),
    fetchServer<Paginated<MarketplaceListing>>(`marketplace/?${params.toString()}`),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-navy">Marketplace</h1>
        <p className="text-sm text-navy/55">Buy and sell within your community.</p>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchBar placeholder="Search items…" />
        </div>
        <Link
          href="/marketplace/new"
          className="inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          + Sell something
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
              href={`/marketplace/${l.id}`}
              title={l.title}
              subtitle={l.price ? `$${l.price}` : "Free"}
              location={l.location}
              imageUrl={l.image_url}
              badge={l.is_hot ? "Hot" : null}
              accent={ACCENT}
              emoji="🛒"
            />
          ))}
        </div>
      )}
    </div>
  );
}
