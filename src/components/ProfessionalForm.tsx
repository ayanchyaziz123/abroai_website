"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import StripeCheckout from "./StripeCheckout";

type Plan = { key: string; label: string; price: string; features: string[] };
type CatalogMeta = { plans: Plan[] };

export default function ProfessionalForm({ type }: { type: "attorney" | "doctor" }) {
  const router = useRouter();

  const [meta, setMeta] = useState<CatalogMeta | null>(null);
  const [plan, setPlan] = useState("");

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [languages, setLanguages] = useState("");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [step, setStep] = useState<"form" | "payment">("form");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api(`/catalog/meta/?type=${type}`, { auth: false })
      .then((data) => {
        const m = data as CatalogMeta;
        setMeta(m);
        if (m.plans.length) setPlan((prev) => prev || m.plans[0].key);
      })
      .catch(() => {});
  }, [type]);

  function buildFormData(subscriptionId?: string) {
    const fd = new FormData();
    fd.append("professional_type", type);
    fd.append("name", name);
    fd.append("organization", organization);
    fd.append("location", location);
    fd.append("specialty", specialty);
    fd.append("languages", languages);
    fd.append("description", description);
    fd.append("contact_phone", contactPhone);
    fd.append("contact_email", contactEmail);
    if (website.trim()) fd.append("website", website.trim());
    fd.append("plan", plan);
    if (imageFile) fd.append("image", imageFile);
    if (subscriptionId) fd.append("subscription_id", subscriptionId);
    return fd;
  }

  async function submitProfessional(subscriptionId?: string) {
    setBusy(true);
    setError("");
    try {
      const fd = buildFormData(subscriptionId);
      const result = (await api("/professionals/", { method: "POST", body: fd })) as { id: number };
      router.push(`/professional?type=${type}&id=${result.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
      setStep("form");
    }
  }

  async function onSubmitForm(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError("");
    if (!name.trim() || !organization.trim() || !location.trim()) return setError("Fill in your name, practice/clinic name, and location.");
    if (!contactPhone.trim() || !contactEmail.trim()) return setError("A contact phone and email are required.");
    if (!plan) return setError("Select a plan.");

    setBusy(true);
    try {
      const data = (await api("/listings/subscription-intent/", {
        method: "POST",
        body: { plan, listing_type: type },
      })) as { client_secret: string };
      setClientSecret(data.client_secret);
      setStep("payment");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't start payment. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (step === "payment" && clientSecret) {
    const selected = meta?.plans.find((p) => p.key === plan);
    return (
      <div>
        <p className="text-[14px] text-ink-dim">
          Subscribe {selected?.price || ""} to publish your {type === "attorney" ? "attorney" : "doctor"} profile.
        </p>
        <StripeCheckout
          clientSecret={clientSecret}
          busyLabel="Publishing…"
          onSuccess={(id) => submitProfessional(id)}
        />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmitForm} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-ink-dim">Full name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-ink-dim">{type === "attorney" ? "Firm name" : "Clinic / practice name"}</span>
        <input
          required
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-ink-dim">Location</span>
        <input
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, State"
          className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-ink-dim">
          {type === "attorney" ? "Specialty (e.g. Immigration law)" : "Specialty (e.g. Family medicine)"}
        </span>
        <input
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-ink-dim">Languages spoken</span>
        <input
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          placeholder="e.g. English, Bengali, Spanish"
          className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-ink-dim">About</span>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
        />
      </label>

      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-ink-dim">Contact phone</span>
          <input
            required
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-ink-dim">Contact email</span>
          <input
            required
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-ink-dim">Website (optional)</span>
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-ink-dim">Photo</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="text-[13px] text-ink-dim"
        />
      </label>

      {meta?.plans && meta.plans.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[12.5px] font-medium text-ink-dim">Plan</span>
          <div className="grid gap-2">
            {meta.plans.map((p) => (
              <button
                type="button"
                key={p.key}
                onClick={() => setPlan(p.key)}
                className="flex flex-col rounded-xl border p-3.5 text-left transition"
                style={{
                  borderColor: plan === p.key ? "var(--accent)" : "var(--line)",
                  backgroundColor: plan === p.key ? "var(--surface-2)" : "var(--surface)",
                }}
              >
                <span className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-ink">{p.label}</span>
                  <span className="text-[14px] font-semibold text-ink">{p.price}</span>
                </span>
                {p.features?.length > 0 && (
                  <ul className="mt-1.5 flex flex-col gap-0.5">
                    {p.features.map((f) => (
                      <li key={f} className="text-[12px] text-ink-dim">
                        · {f}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-[13px] text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="mt-2 rounded-full bg-accent px-5 py-3 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "Please wait…" : "Continue to payment"}
      </button>
    </form>
  );
}
