"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/lib/api-client";
import { Field, inputClass } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import CategoryPicker from "./CategoryPicker";
import ImageUploader, { ExistingImage } from "./ImageUploader";
import type { CatalogMeta, EventListing } from "@/types";

const ACCENT = "#E85555";

function toLocalInputValue(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventForm({ meta, event }: { meta: CatalogMeta; event?: EventListing }) {
  const router = useRouter();
  const isEdit = !!event;

  const [title, setTitle] = useState(event?.title || "");
  const [category, setCategory] = useState(event?.category || meta.categories[0]?.key || "");
  const [dateTime, setDateTime] = useState(toLocalInputValue(event?.date));
  const [location, setLocation] = useState(event?.location || "");
  const [description, setDescription] = useState(event?.description || "");
  const [isFree, setIsFree] = useState(event?.is_free ?? true);
  const [price, setPrice] = useState(event?.price || "");
  const [link, setLink] = useState(event?.link || "");

  const [images, setImages] = useState<File[]>([]);
  const [existing, setExisting] = useState<ExistingImage[]>(event?.gallery || []);
  const [removedIds, setRemovedIds] = useState<number[]>([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function removeExisting(id: number) {
    setExisting((prev) => prev.filter((p) => p.id !== id));
    setRemovedIds((prev) => [...prev, id]);
  }

  const canSubmit = title.trim().length > 2 && !!category && !!dateTime && location.trim().length > 1 && description.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      setError("Please fill in the title, category, date & time, location, and description.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("category", category);
      fd.append("date", new Date(dateTime).toISOString());
      fd.append("location", location.trim());
      fd.append("description", description.trim());
      fd.append("is_free", isFree ? "true" : "false");
      if (!isFree && price.trim()) fd.append("price", price.trim());
      if (link.trim()) fd.append("link", link.trim());
      images.forEach((img) => fd.append("images", img));
      removedIds.forEach((id) => fd.append("remove_image_ids", String(id)));

      const saved = isEdit
        ? await fetchClient<EventListing>(`events/${event!.id}/`, { method: "PATCH", body: fd })
        : await fetchClient<EventListing>("events/", { method: "POST", body: fd });

      router.push(`/events/${saved.id}`);
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
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </Field>

      <Field label="Category *">
        <CategoryPicker categories={meta.categories} value={category} onChange={setCategory} accent={ACCENT} />
      </Field>

      <Field label="Date & time *">
        <input type="datetime-local" className={inputClass} value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
      </Field>

      <Field label="Location *">
        <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Venue or address" required />
      </Field>

      <Field label="Description *">
        <textarea className={`${inputClass} min-h-32`} value={description} onChange={(e) => setDescription(e.target.value)} required />
      </Field>

      <Field label="Admission">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsFree(true)}
            className="flex-1 rounded-xl border px-3 py-2.5 text-sm font-bold transition"
            style={{
              borderColor: isFree ? "#28D99E" : "rgba(0,0,0,0.1)",
              backgroundColor: isFree ? "rgba(40,217,158,0.12)" : "white",
              color: isFree ? "#28D99E" : "var(--foreground)",
            }}
          >
            🆓 Free
          </button>
          <button
            type="button"
            onClick={() => setIsFree(false)}
            className="flex-1 rounded-xl border px-3 py-2.5 text-sm font-bold transition"
            style={{
              borderColor: !isFree ? "#F4A227" : "rgba(0,0,0,0.1)",
              backgroundColor: !isFree ? "rgba(244,162,39,0.12)" : "white",
              color: !isFree ? "#F4A227" : "var(--foreground)",
            }}
          >
            💰 Paid
          </button>
        </div>
      </Field>

      {!isFree && (
        <Field label="Price">
          <input className={inputClass} value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" placeholder="e.g. 10" />
        </Field>
      )}

      <Field label="Registration link (optional)">
        <input className={inputClass} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" type="url" />
      </Field>

      <Field label="Photos">
        <ImageUploader files={images} onFilesChange={setImages} existing={existing} onRemoveExisting={removeExisting} accent={ACCENT} />
      </Field>

      <Button type="submit" loading={submitting} disabled={!canSubmit} className="w-full sm:w-auto">
        {isEdit ? "Save changes" : "Create event"}
      </Button>
    </form>
  );
}
