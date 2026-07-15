import Link from "next/link";
import type { Metadata } from "next";
import { fetchServer } from "@/lib/api-server";
import { getCatalogMeta } from "@/lib/catalog";
import ListingCard from "@/components/listings/ListingCard";
import CategoryFilterBar from "@/components/listings/CategoryFilterBar";
import SearchBar from "@/components/listings/SearchBar";
import type { JobListing, Paginated } from "@/types";

export const metadata: Metadata = { title: "Jobs" };

const ACCENT = "#3B8BF7";

function formatSalary(job: JobListing) {
  if (!job.salary_min && !job.salary_max) return null;
  const per = job.salary_period === "yr" ? "/yr" : "/hr";
  if (job.salary_min && job.salary_max) return `$${job.salary_min}-${job.salary_max}${per}`;
  return `$${job.salary_min ?? job.salary_max}${per}`;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.search) params.set("search", sp.search);
  if (sp.category) params.set("category", sp.category);
  if (sp.sort) params.set("sort", sp.sort);

  const [meta, jobs] = await Promise.all([
    getCatalogMeta("job"),
    fetchServer<Paginated<JobListing>>(`jobs/?${params.toString()}`),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-navy">Jobs</h1>
        <p className="text-sm text-navy/55">Employers hiring in your community.</p>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <SearchBar placeholder="Search jobs, companies…" />
        </div>
        <Link
          href="/jobs/new"
          className="inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          + Post a job
        </Link>
      </div>

      <div className="mt-4">
        <CategoryFilterBar categories={meta.categories} accent={ACCENT} />
      </div>

      {jobs.results.length === 0 ? (
        <div className="mt-16 text-center text-sm text-navy/45">No jobs found. Try a different search or category.</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.results.map((job) => (
            <ListingCard
              key={job.id}
              href={`/jobs/${job.id}`}
              title={job.title}
              subtitle={job.company}
              location={job.location}
              imageUrl={job.image_url}
              badge={job.is_hot ? "Hot" : null}
              accent={ACCENT}
              emoji="💼"
              meta={formatSalary(job)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
