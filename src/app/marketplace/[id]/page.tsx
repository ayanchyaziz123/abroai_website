import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchServer } from "@/lib/api-server";
import { getCurrentUser } from "@/lib/auth";
import { getCatalogMeta } from "@/lib/catalog";
import { ApiError } from "@/lib/api-error";
import OwnerActions from "@/components/listings/OwnerActions";
import type { MarketplaceListing } from "@/types";

const ACCENT = "#28D99E";

async function getItem(id: string): Promise<MarketplaceListing | null> {
  try {
    return await fetchServer<MarketplaceListing>(`marketplace/${id}/`);
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
  const item = await getItem(id);
  return { title: item ? item.title : "Item not found" };
}

export default async function MarketplaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, user, meta] = await Promise.all([getItem(id), getCurrentUser(), getCatalogMeta("marketplace")]);
  if (!item) notFound();

  const category = meta.categories.find((c) => c.key === (item.category || "other"));
  const isOwner = user?.id === item.poster_id;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {item.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image_url} alt={item.title} className="h-64 w-full rounded-2xl object-cover sm:h-80" />
      )}

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {category && (
              <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: `${ACCENT}18`, color: ACCENT }}>
                {category.emoji} {category.label}
              </span>
            )}
            {item.is_hot && <span className="rounded-full bg-brand-red/15 px-2.5 py-1 text-xs font-bold text-brand-red">Hot</span>}
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl">{item.title}</h1>
          <p className="mt-1 text-lg font-bold" style={{ color: ACCENT }}>
            {item.price ? `$${item.price}` : "Free"}
          </p>
          <p className="mt-1 text-sm text-navy/55">📍 {item.location}</p>
        </div>
        {isOwner && (
          <OwnerActions
            editHref={`/marketplace/${item.id}/edit`}
            deletePath={`marketplace/${item.id}/`}
            redirectAfterDelete="/marketplace"
          />
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <h2 className="text-sm font-bold uppercase tracking-wide text-navy/40">Description</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-navy/80">{item.description}</p>
      </div>

      {item.gallery.length > 1 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {item.gallery.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={img.id} src={img.url} alt="" className="h-28 w-full rounded-xl object-cover" />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-5 card-shadow">
        <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
          {item.poster?.[0]?.toUpperCase() || "?"}
        </span>
        <div>
          <p className="text-sm font-bold text-navy">{item.poster}</p>
          <p className="text-xs text-navy/45">Posted {new Date(item.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
