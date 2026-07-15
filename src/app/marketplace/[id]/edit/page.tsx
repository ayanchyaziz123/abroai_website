import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { fetchServer } from "@/lib/api-server";
import { getCatalogMeta } from "@/lib/catalog";
import { ApiError } from "@/lib/api-error";
import MarketplaceForm from "@/components/listings/MarketplaceForm";
import type { MarketplaceListing } from "@/types";

export const metadata: Metadata = { title: "Edit listing" };

export default async function EditMarketplacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/marketplace/${id}/edit`);

  let item: MarketplaceListing;
  try {
    item = await fetchServer<MarketplaceListing>(`marketplace/${id}/`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  if (item.poster_id !== user.id) redirect(`/marketplace/${id}`);

  const meta = await getCatalogMeta("marketplace");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-navy">Edit listing</h1>
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <MarketplaceForm meta={meta} item={item} />
      </div>
    </div>
  );
}
