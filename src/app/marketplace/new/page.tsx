import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getCatalogMeta } from "@/lib/catalog";
import MarketplaceForm from "@/components/listings/MarketplaceForm";

export const metadata: Metadata = { title: "Sell something" };

export default async function NewMarketplacePage() {
  await requireUser("/marketplace/new");
  const meta = await getCatalogMeta("marketplace");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-navy">Sell something</h1>
      <p className="mt-1 text-sm text-navy/55">List an item for your community to see.</p>
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <MarketplaceForm meta={meta} />
      </div>
    </div>
  );
}
