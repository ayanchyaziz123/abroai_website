"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/lib/api-client";
import { Field, inputClass } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import CategoryPicker from "./CategoryPicker";
import PlanPicker from "./PlanPicker";
import ImageUploader, { ExistingImage } from "./ImageUploader";
import type { CatalogMeta, MarketplaceListing } from "@/types";

const ACCENT = "#28D99E";

export default function MarketplaceForm({ meta, item }: { meta: CatalogMeta; item?: MarketplaceListing }) {
  const router = useRouter();
  const isEdit = !!item;

  const [title, setTitle] = useState(item?.title || "");
  const [price, setPrice] = useState(item?.price || "");
  const [location, setLocation] = useState(item?.location || "");
  const [category, setCategory] = useState(item?.category || meta.categories[0]?.key || "");
  const [description, setDescription] = useState(item?.description || "");
  const [plan, setPlan] = useState(item?.plan || meta.plans[0]?.key || "free");

  const [images, setImages] = useState<File[]>([]);
  const [existing, setExisting] = useState<ExistingImage[]>(item?.gallery || []);
  const [removedIds, setRemovedIds] = useState<number[]>([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function removeExisting(id: number) {
    setExisting((prev) => prev.filter((p) => p.id !== id));
    setRemovedIds((prev) => [...prev, id]);
  }

  const canSubmit = title.trim().length > 2 && location.trim().length > 1 && description.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      setError("Please fill in the title, pickup location, and a description (10+ characters).");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("description", description.trim());
      fd.append("price", price.trim());
      fd.append("location", location.trim());
      fd.append("category", category);
      if (!isEdit) fd.append("plan", plan);
      images.forEach((img) => fd.append("images", img));
      removedIds.forEach((id) => fd.append("remove_image_ids", String(id)));

      const saved = isEdit
        ? await fetchClient<MarketplaceListing>(`marketplace/${item!.id}/`, { method: "PATCH", body: fd })
        : await fetchClient<MarketplaceListing>("marketplace/", { method: "POST", body: fd });

      router.push(`/marketplace/${saved.id}`);
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

      <Field label="Title *">
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What are you selling?" required />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Price" hint="Leave blank if free">
          <input className={inputClass} value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" />
        </Field>
        <Field label="Pickup location *">
          <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} required />
        </Field>
      </div>

      <Field label="Category">
        <CategoryPicker categories={meta.categories} value={category} onChange={setCategory} accent={ACCENT} />
      </Field>

      <Field label="Description *" hint={`${description.length} characters (10+ required)`}>
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
        {isEdit ? "Save changes" : "Post listing"}
      </Button>
    </form>
  );
}
