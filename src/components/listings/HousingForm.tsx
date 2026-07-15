"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/lib/api-client";
import { Field, inputClass } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import CategoryPicker from "./CategoryPicker";
import PlanPicker from "./PlanPicker";
import ImageUploader, { ExistingImage } from "./ImageUploader";
import type { CatalogMeta, HousingListing } from "@/types";

const ACCENT = "#F4A227";

export default function HousingForm({ meta, listing }: { meta: CatalogMeta; listing?: HousingListing }) {
  const router = useRouter();
  const isEdit = !!listing;

  const [title, setTitle] = useState(listing?.title || "");
  const [price, setPrice] = useState(listing?.price || "");
  const [location, setLocation] = useState(listing?.location || "");
  const [category, setCategory] = useState(listing?.category || meta.categories[0]?.key || "");
  const [bedrooms, setBedrooms] = useState(listing?.bedrooms != null ? String(listing.bedrooms) : "");
  const [bathrooms, setBathrooms] = useState(listing?.bathrooms || "");
  const [sqft, setSqft] = useState(listing?.sqft != null ? String(listing.sqft) : "");
  const [moveInDate, setMoveInDate] = useState(listing?.move_in_date || "");
  const [amenities, setAmenities] = useState<string[]>(listing?.amenities ? listing.amenities.split(",").filter(Boolean) : []);
  const [description, setDescription] = useState(listing?.description || "");
  const [plan, setPlan] = useState(listing?.plan || meta.plans[0]?.key || "free");

  const [images, setImages] = useState<File[]>([]);
  const [existing, setExisting] = useState<ExistingImage[]>(listing?.gallery || []);
  const [removedIds, setRemovedIds] = useState<number[]>([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function removeExisting(id: number) {
    setExisting((prev) => prev.filter((p) => p.id !== id));
    setRemovedIds((prev) => [...prev, id]);
  }

  function toggleAmenity(a: string) {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  const canSubmit = title.trim().length > 2 && Number(price) > 0 && location.trim().length > 1 && description.trim().length >= 20;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      setError("Please fill in the title, monthly rent, location, and a description (20+ characters).");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("price", price.trim());
      fd.append("location", location.trim());
      fd.append("description", description.trim());
      fd.append("category", category);
      if (bedrooms !== "") fd.append("bedrooms", bedrooms);
      if (bathrooms) fd.append("bathrooms", String(bathrooms));
      if (sqft) fd.append("sqft", sqft);
      if (moveInDate) fd.append("move_in_date", moveInDate);
      fd.append("amenities", amenities.join(","));
      if (!isEdit) fd.append("plan", plan);
      images.forEach((img) => fd.append("images", img));
      removedIds.forEach((id) => fd.append("remove_image_ids", String(id)));

      const saved = isEdit
        ? await fetchClient<HousingListing>(`housing/${listing!.id}/`, { method: "PATCH", body: fd })
        : await fetchClient<HousingListing>("housing/", { method: "POST", body: fd });

      router.push(`/housing/${saved.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-lg bg-brand-red/10 px-3 py-2 text-sm font-medium text-brand-red">{error}</div>}

      <Field label="Listing title *">
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 1BR in Jackson Heights" required />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Monthly rent *">
          <input className={inputClass} value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" required />
        </Field>
        <Field label="Location *">
          <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} required />
        </Field>
      </div>

      <Field label="Category">
        <CategoryPicker categories={meta.categories} value={category} onChange={setCategory} accent={ACCENT} />
      </Field>

      <Field label="Bedrooms">
        <div className="flex flex-wrap gap-2">
          {(meta.bedroom_options || []).map((opt) => (
            <button
              type="button"
              key={opt.key}
              onClick={() => setBedrooms(bedrooms === opt.key ? "" : opt.key)}
              className="rounded-xl border px-3.5 py-2 text-sm font-semibold transition"
              style={{
                borderColor: bedrooms === opt.key ? ACCENT : "rgba(0,0,0,0.1)",
                backgroundColor: bedrooms === opt.key ? `${ACCENT}14` : "white",
                color: bedrooms === opt.key ? ACCENT : "var(--foreground)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Bathrooms (optional)">
          <input className={inputClass} value={bathrooms} onChange={(e) => setBathrooms(e.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" />
        </Field>
        <Field label="Sqft (optional)">
          <input className={inputClass} value={sqft} onChange={(e) => setSqft(e.target.value.replace(/\D/g, ""))} inputMode="numeric" />
        </Field>
      </div>

      <Field label="Move-in date (optional)">
        <input type="date" className={inputClass} value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} />
      </Field>

      <Field label="Amenities (optional)">
        <div className="flex flex-wrap gap-2">
          {(meta.amenities || []).map((a) => (
            <button
              type="button"
              key={a.label}
              onClick={() => toggleAmenity(a.label)}
              className="rounded-xl border px-3 py-2 text-sm font-semibold transition"
              style={{
                borderColor: amenities.includes(a.label) ? ACCENT : "rgba(0,0,0,0.1)",
                backgroundColor: amenities.includes(a.label) ? `${ACCENT}14` : "white",
                color: amenities.includes(a.label) ? ACCENT : "var(--foreground)",
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Description *" hint={`${description.length} characters (20+ required)`}>
        <textarea className={`${inputClass} min-h-32`} value={description} onChange={(e) => setDescription(e.target.value)} required />
      </Field>

      <Field label="Photos">
        <ImageUploader files={images} onFilesChange={setImages} existing={existing} onRemoveExisting={removeExisting} accent={ACCENT} />
      </Field>

      {!isEdit && (
        <Field label="Listing plan">
          <PlanPicker plans={meta.plans} value={plan} onChange={setPlan} />
        </Field>
      )}

      <Button type="submit" loading={submitting} disabled={!canSubmit} className="w-full sm:w-auto">
        {isEdit ? "Save changes" : "List this home"}
      </Button>
    </form>
  );
}
