import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchServer } from "@/lib/api-server";
import { getCurrentUser } from "@/lib/auth";
import { getCatalogMeta } from "@/lib/catalog";
import { ApiError } from "@/lib/api-error";
import OwnerActions from "@/components/listings/OwnerActions";
import type { JobListing } from "@/types";

const ACCENT = "#3B8BF7";

async function getJob(id: string): Promise<JobListing | null> {
  try {
    return await fetchServer<JobListing>(`jobs/${id}/`);
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
  const job = await getJob(id);
  return { title: job ? `${job.title} at ${job.company}` : "Job not found" };
}

function formatSalary(job: JobListing) {
  if (!job.salary_min && !job.salary_max) return null;
  const per = job.salary_period === "yr" ? "/yr" : "/hr";
  if (job.salary_min && job.salary_max) return `$${job.salary_min}–${job.salary_max}${per}`;
  return `$${job.salary_min ?? job.salary_max}${per}`;
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  remote: "Remote",
};

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [job, user, meta] = await Promise.all([getJob(id), getCurrentUser(), getCatalogMeta("job")]);
  if (!job) notFound();

  const category = meta.categories.find((c) => c.key === job.category);
  const isOwner = user?.id === job.poster_id;
  const salary = formatSalary(job);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {job.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={job.image_url}
          alt={job.title}
          className="h-64 w-full rounded-2xl object-cover sm:h-80"
        />
      )}

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {category && (
              <span
                className="rounded-full px-2.5 py-1 text-xs font-bold"
                style={{ backgroundColor: `${ACCENT}18`, color: ACCENT }}
              >
                {category.emoji} {category.label}
              </span>
            )}
            {job.is_hot && (
              <span className="rounded-full bg-brand-red/15 px-2.5 py-1 text-xs font-bold text-brand-red">
                Hot
              </span>
            )}
          </div>
          <h1 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl">{job.title}</h1>
          <p className="mt-1 text-lg font-bold" style={{ color: ACCENT }}>
            {job.company}
          </p>
          <p className="mt-1 text-sm text-navy/55">📍 {job.location}</p>
        </div>
        {isOwner && (
          <OwnerActions
            editHref={`/jobs/${job.id}/edit`}
            deletePath={`jobs/${job.id}/`}
            redirectAfterDelete="/jobs"
          />
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {job.employment_type && (
          <span className="rounded-lg bg-black/5 px-3 py-1.5 text-xs font-semibold text-navy/70">
            {EMPLOYMENT_LABELS[job.employment_type] || job.employment_type}
          </span>
        )}
        {salary && (
          <span className="rounded-lg bg-brand-teal/15 px-3 py-1.5 text-xs font-bold text-brand-teal">
            {salary}
          </span>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <h2 className="text-sm font-bold uppercase tracking-wide text-navy/40">Description</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-navy/80">{job.description}</p>
      </div>

      {job.gallery.length > 1 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {job.gallery.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={img.id} src={img.url} alt="" className="h-28 w-full rounded-xl object-cover" />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-5 card-shadow">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          {job.poster?.[0]?.toUpperCase() || "?"}
        </span>
        <div>
          <p className="text-sm font-bold text-navy">{job.poster}</p>
          <p className="text-xs text-navy/45">Posted {new Date(job.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
