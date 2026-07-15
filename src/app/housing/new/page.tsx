import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getCatalogMeta } from "@/lib/catalog";
import HousingForm from "@/components/listings/HousingForm";

export const metadata: Metadata = { title: "List a home" };

export default async function NewHousingPage() {
  await requireUser("/housing/new");
  const meta = await getCatalogMeta("housing");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-navy">List a home</h1>
      <p className="mt-1 text-sm text-navy/55">Rooms, apartments, and sublets — posted in minutes.</p>
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <HousingForm meta={meta} />
      </div>
    </div>
  );
}
