import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchServer } from "@/lib/api-server";
import { getCurrentUser } from "@/lib/auth";
import { getCatalogMeta } from "@/lib/catalog";
import { ApiError } from "@/lib/api-error";
import OwnerActions from "@/components/listings/OwnerActions";
import type { HousingListing } from "@/types";

const ACCENT = "#F4A227";

async function getListing(id: string): Promise<HousingListing | null> {
  try {
    return await fetchServer<HousingListing>(`housing/${id}/`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  return { title: listing ? listing.title : "Listing not found" };
}

export default async function HousingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [listing, user, meta] = await Promise.all([getListing(id), getCurrentUser(), getCatalogMeta("housing")]);
  if (!listing) notFound();

  const category = meta.categories.find((c) => c.key === listing.category);
  const isOwner = user?.id === listing.poster_id;
  const amenities = listing.amenities ? listing.amenities.split(",").filter(Boolean) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {listing.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={listing.image_url} alt={listing.title} className="h-64 w-full rounded-2xl object-cover sm:h-80" />
      )}

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {category && (
              <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: `${ACCENT}18`, color: ACCENT }}>
                {category.emoji} {category.label}
              </span>
            )}
            {listing.is_featured && (
              <span className="rounded-full bg-brand-purple/15 px-2.5 py-1 text-xs font-bold text-brand-purple">Featured</span>
            )}
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl">{listing.title}</h1>
          <p className="mt-1 text-lg font-bold" style={{ color: ACCENT }}>
            ${listing.price}/mo
          </p>
          <p className="mt-1 text-sm text-navy/55">📍 {listing.location}</p>
        </div>
        {isOwner && (
          <OwnerActions editHref={`/housing/${listing.id}/edit`} deletePath={`housing/${listing.id}/`} redirectAfterDelete="/housing" />
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {listing.bedrooms != null && (
          <span className="rounded-lg bg-black/5 px-3 py-1.5 text-xs font-semibold text-navy/70">
            {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} bed`}
          </span>
        )}
        {listing.bathrooms && (
          <span className="rounded-lg bg-black/5 px-3 py-1.5 text-xs font-semibold text-navy/70">{listing.bathrooms} bath</span>
        )}
        {listing.sqft && (
          <span className="rounded-lg bg-black/5 px-3 py-1.5 text-xs font-semibold text-navy/70">{listing.sqft} sqft</span>
        )}
        {listing.move_in_date && (
          <span className="rounded-lg bg-brand-teal/15 px-3 py-1.5 text-xs font-bold text-brand-teal">
            Move-in {new Date(listing.move_in_date).toLocaleDateString()}
          </span>
        )}
      </div>

      {amenities.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {amenities.map((a) => (
            <span key={a} className="rounded-lg border border-black/10 px-2.5 py-1 text-xs font-medium text-navy/60">
              {a}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <h2 className="text-sm font-bold uppercase tracking-wide text-navy/40">Description</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-navy/80">{listing.description}</p>
      </div>

      {listing.gallery.length > 1 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {listing.gallery.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={img.id} src={img.url} alt="" className="h-28 w-full rounded-xl object-cover" />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-5 card-shadow">
        <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
          {listing.poster?.[0]?.toUpperCase() || "?"}
        </span>
        <div>
          <p className="text-sm font-bold text-navy">{listing.poster}</p>
          <p className="text-xs text-navy/45">Posted {new Date(listing.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
