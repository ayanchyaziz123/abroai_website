import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { fetchServer } from "@/lib/api-server";
import { getCatalogMeta } from "@/lib/catalog";
import { ApiError } from "@/lib/api-error";
import HousingForm from "@/components/listings/HousingForm";
import type { HousingListing } from "@/types";

export const metadata: Metadata = { title: "Edit listing" };

export default async function EditHousingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/housing/${id}/edit`);

  let listing: HousingListing;
  try {
    listing = await fetchServer<HousingListing>(`housing/${id}/`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  if (listing.poster_id !== user.id) redirect(`/housing/${id}`);

  const meta = await getCatalogMeta("housing");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-navy">Edit listing</h1>
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <HousingForm meta={meta} listing={listing} />
      </div>
    </div>
  );
}
