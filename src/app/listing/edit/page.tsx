"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import ListingForm from "@/components/ListingForm";
import { getListingType } from "@/lib/listingTypes";

function EditContent() {
  const searchParams = useSearchParams();
  const typeKey = searchParams.get("type") || "";
  const id = searchParams.get("id") || "";
  const cfg = getListingType(typeKey);

  if (!cfg || !id) {
    return <p className="mx-auto max-w-lg px-6 py-16 text-[14px] text-red-600">Missing listing.</p>;
  }

  return (
    <RequireAuth>
      <h1 className="font-display text-3xl font-semibold text-ink">Edit listing</h1>
      <p className="mt-2 text-[14px] text-ink-dim">Plan and pricing can only be changed from the Abrofy app for now.</p>
      <div className="mt-8">
        <ListingForm cfg={cfg} mode="edit" id={id} />
      </div>
    </RequireAuth>
  );
}

export default function EditListingPage() {
  return (
    <div className="min-h-full bg-ground">
      <Nav />
      <main className="mx-auto max-w-lg px-6 py-12">
        <Suspense fallback={null}>
          <EditContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
