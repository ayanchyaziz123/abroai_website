"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

type ProfessionalDetail = {
  name: string;
  organization?: string;
  location?: string;
  description?: string;
  image_url?: string | null;
  languages?: string;
  specialty?: string;
  contact_phone?: string;
  contact_email?: string;
  website?: string;
  is_verified?: boolean;
  years_experience?: number | null;
  accepts_insurance?: boolean;
};

function DetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  const [item, setItem] = useState<ProfessionalDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api(`/professionals/${id}/`, { auth: false })
      .then((data) => setItem(data as ProfessionalDetail))
      .catch(() => setError("This profile couldn't be found."));
  }, [id]);

  return (
    <div className="min-h-full bg-ground">
      <Nav />
      <main className="mx-auto max-w-2xl px-6 py-12">
        {error && <p className="text-[14px] text-red-600">{error}</p>}

        {!error && !item && (
          <div className="animate-pulse space-y-4">
            <div className="h-40 w-40 rounded-full bg-surface-2" />
            <div className="h-6 w-2/3 rounded bg-surface-2" />
          </div>
        )}

        {item && (
          <>
            <div className="flex items-center gap-4">
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt="" className="h-24 w-24 rounded-full object-cover" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-2xl font-bold text-white">
                  {item.name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <div>
                <h1 className="font-display text-2xl font-semibold text-ink">{item.name}</h1>
                {item.organization && <p className="text-[14px] text-ink-dim">{item.organization}</p>}
                {item.is_verified && (
                  <span className="mt-1 inline-block rounded-full bg-accent-dim px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                    ✓ Verified by Abrofy
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-[13.5px] text-ink-dim">
              {item.location && <span>{item.location}</span>}
              {item.specialty && <span>{item.specialty}</span>}
              {item.languages && <span>Speaks {item.languages}</span>}
              {item.years_experience != null && <span>{item.years_experience} yrs experience</span>}
            </div>

            {item.description && (
              <p className="mt-6 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink">{item.description}</p>
            )}

            <div className="mt-8 rounded-xl border border-line bg-surface p-4">
              <p className="text-[12.5px] font-medium text-ink-dim">Contact</p>
              {item.contact_phone && <p className="text-[14px] text-ink">{item.contact_phone}</p>}
              {item.contact_email && <p className="text-[14px] text-ink">{item.contact_email}</p>}
              {!item.contact_phone && !item.contact_email && (
                <p className="mt-1 text-[12.5px] text-ink-faint">
                  Message them in the{" "}
                  <a href="/#download" className="font-medium text-accent hover:underline">
                    Abrofy app
                  </a>
                  .
                </p>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function ProfessionalPage() {
  return (
    <Suspense fallback={null}>
      <DetailContent />
    </Suspense>
  );
}
