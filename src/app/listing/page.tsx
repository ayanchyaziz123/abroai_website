"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getListingType } from "@/lib/listingTypes";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type ListingDetail = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  image_url?: string | null;
  images?: { image_url: string }[];
  gallery?: string[];
  plan?: string;
  poster?: string;
  poster_id?: number;
  price?: string | number | null;
  company?: string;
  salary_min?: string | number | null;
  salary_max?: string | number | null;
  salary_period?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sqft?: number | null;
  is_active?: boolean;
};

function DetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const typeKey = searchParams.get("type") || "";
  const id = searchParams.get("id") || "";
  const cfg = getListingType(typeKey);

  const [item, setItem] = useState<ListingDetail | null>(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!cfg || !id) return;
    let cancelled = false;
    api(`${cfg.apiBase}${id}/`, { auth: false })
      .then((data) => {
        if (!cancelled) setItem(data as ListingDetail);
      })
      .catch(() => {
        if (!cancelled) setError("This listing couldn't be found. It may have been removed.");
      });
    return () => {
      cancelled = true;
    };
  }, [cfg, id]);

  if (!cfg) {
    return <p className="mx-auto max-w-2xl px-6 py-16 text-[14px] text-red-600">Unknown listing type.</p>;
  }

  const isOwner = !!(user && item?.poster_id && user.id === item.poster_id);
  const gallery = item?.gallery?.length ? item.gallery : item?.image_url ? [item.image_url] : [];

  async function onDelete() {
    if (!confirm("Delete this listing permanently?")) return;
    setDeleting(true);
    try {
      await api(`${cfg!.apiBase}${id}/`, { method: "DELETE" });
      router.push("/browse");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Couldn't delete this listing.");
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-full bg-ground">
      <Nav />
      <main className="mx-auto max-w-2xl px-6 py-12">
        {error && <p className="text-[14px] text-red-600">{error}</p>}

        {!error && !item && (
          <div className="animate-pulse space-y-4">
            <div className="aspect-[4/3] w-full rounded-2xl bg-surface-2" />
            <div className="h-6 w-2/3 rounded bg-surface-2" />
            <div className="h-4 w-1/3 rounded bg-surface-2" />
          </div>
        )}

        {item && (
          <>
            {gallery.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-line bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={gallery[0]} alt="" className="aspect-[4/3] w-full object-cover" />
              </div>
            )}

            <div className="mt-6 flex items-start justify-between gap-4">
              <h1 className="font-display text-2xl font-semibold text-ink">{item.title}</h1>
              {item.plan && item.plan !== "free" && (
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: cfg.accent }}
                >
                  {item.plan.charAt(0).toUpperCase() + item.plan.slice(1)}
                </span>
              )}
            </div>

            {item.is_active === false && (
              <p className="mt-2 text-[13px] font-medium text-amber-600">This listing is no longer active.</p>
            )}

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] text-ink-dim">
              {item.company && <span>{item.company}</span>}
              {cfg.hasPrice && item.price != null && <span className="font-medium text-ink">${item.price}</span>}
              {item.salary_min != null && (
                <span>
                  ${item.salary_min}
                  {item.salary_max != null ? `–$${item.salary_max}` : ""} /{item.salary_period === "yr" ? "yr" : "hr"}
                </span>
              )}
              {item.location && <span>{item.location}</span>}
              {item.bedrooms != null && <span>{item.bedrooms} bed</span>}
              {item.bathrooms != null && <span>{item.bathrooms} bath</span>}
              {item.sqft != null && <span>{item.sqft} sqft</span>}
            </div>

            {item.description && (
              <p className="mt-6 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink">{item.description}</p>
            )}

            <div className="mt-8 rounded-xl border border-line bg-surface p-4">
              <p className="text-[12.5px] font-medium text-ink-dim">Posted by</p>
              <p className="text-[14px] text-ink">{item.poster || "Abrofy member"}</p>
              {!isOwner && (
                <p className="mt-2 text-[12.5px] text-ink-faint">
                  Message them in the{" "}
                  <a href="/#download" className="font-medium text-accent hover:underline">
                    Abrofy app
                  </a>
                  .
                </p>
              )}
            </div>

            {isOwner && (
              <div className="mt-6 flex gap-3">
                <Link
                  href={`/listing/edit?type=${cfg.key}&id=${id}`}
                  className="rounded-full border border-line px-5 py-2.5 text-[13px] font-semibold text-ink transition hover:bg-surface-2"
                >
                  Edit
                </Link>
                <button
                  onClick={onDelete}
                  disabled={deleting}
                  className="rounded-full border border-red-200 px-5 py-2.5 text-[13px] font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function ListingPage() {
  return (
    <Suspense fallback={null}>
      <DetailContent />
    </Suspense>
  );
}
