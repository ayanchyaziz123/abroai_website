"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/lib/api-client";
import { Field, inputClass } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import CategoryPicker from "./CategoryPicker";
import PlanPicker from "./PlanPicker";
import ImageUploader, { ExistingImage } from "./ImageUploader";
import type { CatalogMeta, JobListing } from "@/types";

const ACCENT = "#3B8BF7";

export default function JobForm({ meta, job }: { meta: CatalogMeta; job?: JobListing }) {
  const router = useRouter();
  const isEdit = !!job;

  const [title, setTitle] = useState(job?.title || "");
  const [company, setCompany] = useState(job?.company || "");
  const [location, setLocation] = useState(job?.location || "");
  const [category, setCategory] = useState(job?.category || meta.categories[0]?.key || "");
  const [employmentType, setEmploymentType] = useState(job?.employment_type || "");
  const [salaryMin, setSalaryMin] = useState(job?.salary_min || "");
  const [salaryMax, setSalaryMax] = useState(job?.salary_max || "");
  const [salaryPeriod, setSalaryPeriod] = useState(job?.salary_period || "hr");
  const [description, setDescription] = useState(job?.description || "");
  const [plan, setPlan] = useState(job?.plan || meta.plans[0]?.key || "free");

  const [images, setImages] = useState<File[]>([]);
  const [existing, setExisting] = useState<ExistingImage[]>(job?.gallery || []);
  const [removedIds, setRemovedIds] = useState<number[]>([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function removeExisting(id: number) {
    setExisting((prev) => prev.filter((p) => p.id !== id));
    setRemovedIds((prev) => [...prev, id]);
  }

  const canSubmit = title.trim().length > 2 && company.trim().length > 1 && location.trim().length > 1 && description.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      setError("Please fill in the title, company, location, and a description (10+ characters).");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("company", company.trim());
      fd.append("location", location.trim());
      fd.append("description", description.trim());
      fd.append("category", category);
      fd.append("employment_type", employmentType);
      fd.append("salary_period", salaryPeriod);
      if (salaryMin) fd.append("salary_min", String(salaryMin));
      if (salaryMax) fd.append("salary_max", String(salaryMax));
      if (!isEdit) fd.append("plan", plan);
      images.forEach((img) => fd.append("images", img));
      removedIds.forEach((id) => fd.append("remove_image_ids", String(id)));

      const saved = isEdit
        ? await fetchClient<JobListing>(`jobs/${job!.id}/`, { method: "PATCH", body: fd })
        : await fetchClient<JobListing>("jobs/", { method: "POST", body: fd });

      router.push(`/jobs/${saved.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-brand-red/10 px-3 py-2 text-sm font-medium text-brand-red">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Job title *">
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Field>
        <Field label="Company *">
          <input className={inputClass} value={company} onChange={(e) => setCompany(e.target.value)} required />
        </Field>
      </div>

      <Field label="Location *">
        <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" required />
      </Field>

      <Field label="Category">
        <CategoryPicker categories={meta.categories} value={category} onChange={setCategory} accent={ACCENT} />
      </Field>

      <Field label="Employment type">
        <div className="flex flex-wrap gap-2">
          {(meta.employment_types || []).map((opt) => (
            <button
              type="button"
              key={opt.key}
              onClick={() => setEmploymentType(employmentType === opt.key ? "" : opt.key)}
              className="rounded-xl border px-3 py-2 text-sm font-semibold transition"
              style={{
                borderColor: employmentType === opt.key ? ACCENT : "rgba(0,0,0,0.1)",
                backgroundColor: employmentType === opt.key ? `${ACCENT}14` : "white",
                color: employmentType === opt.key ? ACCENT : "var(--foreground)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Salary (optional)">
        <div className="flex items-center gap-2">
          <input
            className={inputClass}
            placeholder="Min"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value.replace(/[^\d.]/g, ""))}
            inputMode="decimal"
          />
          <span className="text-navy/40">–</span>
          <input
            className={inputClass}
            placeholder="Max"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value.replace(/[^\d.]/g, ""))}
            inputMode="decimal"
          />
          <select
            className={`${inputClass} w-24 shrink-0`}
            value={salaryPeriod}
            onChange={(e) => setSalaryPeriod(e.target.value)}
          >
            <option value="hr">/hr</option>
            <option value="yr">/yr</option>
          </select>
        </div>
      </Field>

      <Field label="Description *" hint={`${description.length} characters (10+ required)`}>
        <textarea
          className={`${inputClass} min-h-32`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Field>

      <Field label="Photos">
        <ImageUploader
          files={images}
          onFilesChange={setImages}
          existing={existing}
          onRemoveExisting={removeExisting}
          accent={ACCENT}
        />
      </Field>

      {!isEdit && (
        <Field label="Listing plan">
          <PlanPicker plans={meta.plans} value={plan} onChange={setPlan} />
        </Field>
      )}

      <Button type="submit" loading={submitting} disabled={!canSubmit} className="w-full sm:w-auto">
        {isEdit ? "Save changes" : "Post job"}
      </Button>
    </form>
  );
}
