import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { fetchServer } from "@/lib/api-server";
import { getCatalogMeta } from "@/lib/catalog";
import { ApiError } from "@/lib/api-error";
import JobForm from "@/components/listings/JobForm";
import type { JobListing } from "@/types";

export const metadata: Metadata = { title: "Edit job" };

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/jobs/${id}/edit`);

  let job: JobListing;
  try {
    job = await fetchServer<JobListing>(`jobs/${id}/`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  if (job.poster_id !== user.id) redirect(`/jobs/${id}`);

  const meta = await getCatalogMeta("job");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-navy">Edit job</h1>
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <JobForm meta={meta} job={job} />
      </div>
    </div>
  );
}
