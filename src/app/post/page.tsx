"use client";

import { Suspense, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import ListingForm from "@/components/ListingForm";
import ProfessionalForm from "@/components/ProfessionalForm";
import { LISTING_TYPES } from "@/lib/listingTypes";

type Kind = null | "listing" | "professional";
type ProfessionalType = "attorney" | "doctor";

function KindPicker({ onPick }: { onPick: (kind: Kind) => void }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <button
        onClick={() => onPick("listing")}
        className="flex flex-col items-start gap-2 rounded-2xl border border-line bg-surface p-6 text-left transition hover:border-accent hover:shadow-md"
      >
        <span className="text-[26px]">💼</span>
        <span className="font-display text-lg font-semibold text-ink">Listing</span>
        <span className="text-[13px] text-ink-dim">A job, room, item for sale, service, or ride.</span>
      </button>
      <button
        onClick={() => onPick("professional")}
        className="flex flex-col items-start gap-2 rounded-2xl border border-line bg-surface p-6 text-left transition hover:border-accent hover:shadow-md"
      >
        <span className="text-[26px]">⚖️</span>
        <span className="font-display text-lg font-semibold text-ink">Professional profile</span>
        <span className="text-[13px] text-ink-dim">A lawyer or doctor profile, reviewed and featured on Abrofy.</span>
      </button>
    </div>
  );
}

function ProfessionalTypePicker({ onPick }: { onPick: (t: ProfessionalType) => void }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button
        onClick={() => onPick("attorney")}
        className="rounded-full bg-surface-2 px-4 py-2 text-[13px] font-medium text-ink-dim transition hover:bg-accent-dim hover:text-accent"
      >
        ⚖️ Lawyer
      </button>
      <button
        onClick={() => onPick("doctor")}
        className="rounded-full bg-surface-2 px-4 py-2 text-[13px] font-medium text-ink-dim transition hover:bg-accent-dim hover:text-accent"
      >
        🩺 Doctor
      </button>
    </div>
  );
}

function CreateContent() {
  const [kind, setKind] = useState<Kind>(null);
  const [typeKey, setTypeKey] = useState(LISTING_TYPES[0].key);
  const [profType, setProfType] = useState<ProfessionalType | null>(null);
  const cfg = LISTING_TYPES.find((t) => t.key === typeKey)!;

  function back() {
    if (kind === "professional" && profType) {
      setProfType(null);
    } else {
      setKind(null);
      setProfType(null);
    }
  }

  return (
    <RequireAuth>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">
          {kind === null ? "Create" : kind === "listing" ? "Post a listing" : "Add a professional profile"}
        </h1>
        {kind !== null && (
          <button onClick={back} className="text-[12.5px] font-medium text-accent hover:underline">
            Back
          </button>
        )}
      </div>
      <p className="mt-2 text-[14px] text-ink-dim">Shared with the whole Abrofy community — web and app.</p>

      {kind === null && <KindPicker onPick={setKind} />}

      {kind === "listing" && (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            {LISTING_TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => setTypeKey(t.key)}
                className="rounded-full px-4 py-2 text-[13px] font-medium transition"
                style={
                  t.key === typeKey
                    ? { backgroundColor: t.accent, color: "#fff" }
                    : { backgroundColor: "var(--surface-2)", color: "var(--ink-dim)" }
                }
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-8">
            <ListingForm cfg={cfg} mode="create" key={typeKey} />
          </div>
        </>
      )}

      {kind === "professional" && profType === null && <ProfessionalTypePicker onPick={setProfType} />}

      {kind === "professional" && profType !== null && (
        <div className="mt-8">
          <ProfessionalForm type={profType} key={profType} />
        </div>
      )}
    </RequireAuth>
  );
}

export default function PostPage() {
  return (
    <div className="min-h-full bg-ground">
      <Nav />
      <main className="mx-auto max-w-lg px-6 py-12">
        <Suspense fallback={null}>
          <CreateContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
