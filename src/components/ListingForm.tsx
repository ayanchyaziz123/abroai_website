"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ListingTypeConfig } from "@/lib/listingTypes";
import { api, ApiError } from "@/lib/api";
import StripeCheckout from "./StripeCheckout";

type Plan = {
  key: string;
  label: string;
  price: string;
  price_cents: number;
  features: string[];
  color?: string;
  badge?: string;
};

type Category = { key: string; label: string };

type CatalogMeta = {
  categories: Category[];
  plans: Plan[];
};

type Mode = "create" | "edit";

export default function ListingForm({ cfg, mode, id }: { cfg: ListingTypeConfig; mode: Mode; id?: string }) {
  const router = useRouter();

  const [meta, setMeta] = useState<CatalogMeta | null>(null);
  const [loadingItem, setLoadingItem] = useState(mode === "edit");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [plan, setPlan] = useState("free");
  const [extra, setExtra] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const [step, setStep] = useState<"form" | "payment">("form");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api(`/catalog/meta/?type=${cfg.catalogType}`, { auth: false })
      .then((data) => setMeta(data as CatalogMeta))
      .catch(() => {});
  }, [cfg.catalogType]);

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    api(`${cfg.apiBase}${id}/`)
      .then((data) => {
        const item = data as Record<string, unknown>;
        setTitle((item.title as string) || "");
        setDescription((item.description as string) || "");
        setLocation((item.location as string) || "");
        setCategory((item.category as string) || "");
        setPlan((item.plan as string) || "free");
        setExistingImageUrl((item.image_url as string) || null);
        const nextExtra: Record<string, string> = {};
        for (const f of cfg.extraFields) {
          if (item[f.key] != null) nextExtra[f.key] = String(item[f.key]);
        }
        setExtra(nextExtra);
      })
      .catch(() => setError("Couldn't load this listing."))
      .finally(() => setLoadingItem(false));
  }, [mode, id, cfg]);

  function buildFormData(paymentIntentId?: string) {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("location", location);
    if (cfg.hasCategory) fd.append("category", category);
    if (mode === "create") fd.append("plan", plan);
    for (const f of cfg.extraFields) {
      const v = extra[f.key];
      if (v !== undefined && v !== "") fd.append(f.key, v);
    }
    if (imageFile) fd.append("image", imageFile);
    if (paymentIntentId) fd.append("payment_intent_id", paymentIntentId);
    return fd;
  }

  async function submitListing(paymentIntentId?: string) {
    setBusy(true);
    setError("");
    try {
      const fd = buildFormData(paymentIntentId);
      const result =
        mode === "create"
          ? await api(cfg.apiBase, { method: "POST", body: fd })
          : await api(`${cfg.apiBase}${id}/`, { method: "PATCH", body: fd });
      const newId = (result as { id: string }).id;
      router.push(`/listing?type=${cfg.key}&id=${newId}`);
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

    const needsPayment = mode === "create" && (plan === "standard" || plan === "premium");
    if (!needsPayment) {
      await submitListing();
      return;
    }

    setBusy(true);
    try {
      const data = (await api("/listings/payment-intent/", {
        method: "POST",
        body: { plan, listing_type: cfg.key },
      })) as { client_secret: string };
      setClientSecret(data.client_secret);
      setStep("payment");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't start payment. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loadingItem) {
    return <p className="text-[14px] text-ink-dim">Loading…</p>;
  }

  if (step === "payment" && clientSecret) {
    const selected = meta?.plans.find((p) => p.key === plan);
    return (
      <div>
        <p className="text-[14px] text-ink-dim">
          Pay {selected?.price || ""} to publish this listing as {selected?.label || plan}.
        </p>
        <StripeCheckout
          clientSecret={clientSecret}
          busyLabel="Publishing…"
          onSuccess={(paymentIntentId) => submitListing(paymentIntentId)}
        />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmitForm} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-ink-dim">Title</span>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-ink-dim">Description</span>
        <textarea
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

      {cfg.hasCategory && (
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-ink-dim">Category</span>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
          >
            <option value="">Select a category</option>
            {meta?.categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {cfg.hasPrice && (
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-ink-dim">{cfg.priceLabel || "Price"}</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={extra.price ?? ""}
            onChange={(e) => setExtra((prev) => ({ ...prev, price: e.target.value }))}
            className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
          />
        </label>
      )}

      {cfg.extraFields.map((f) => (
        <label key={f.key} className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-ink-dim">{f.label}</span>
          {f.kind === "select" ? (
            <select
              value={extra[f.key] ?? ""}
              onChange={(e) => setExtra((prev) => ({ ...prev, [f.key]: e.target.value }))}
              className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
            >
              <option value="">—</option>
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={f.kind === "number" ? "number" : "text"}
              required={f.required}
              placeholder={f.placeholder}
              value={extra[f.key] ?? ""}
              onChange={(e) => setExtra((prev) => ({ ...prev, [f.key]: e.target.value }))}
              className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
            />
          )}
        </label>
      ))}

      <label className="flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-ink-dim">Photo</span>
        {existingImageUrl && !imageFile && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={existingImageUrl} alt="" className="mb-1 h-32 w-32 rounded-xl object-cover" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="text-[13px] text-ink-dim"
        />
      </label>

      {mode === "create" && meta?.plans && meta.plans.length > 0 && (
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
                  borderColor: plan === p.key ? cfg.accent : "var(--line)",
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
        {busy
          ? "Please wait…"
          : mode === "create"
          ? plan === "free"
            ? "Publish listing"
            : "Continue to payment"
          : "Save changes"}
      </button>
    </form>
  );
}
