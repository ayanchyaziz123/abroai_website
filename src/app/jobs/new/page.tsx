import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getCatalogMeta } from "@/lib/catalog";
import JobForm from "@/components/listings/JobForm";

export const metadata: Metadata = { title: "Post a job" };

export default async function NewJobPage() {
  await requireUser("/jobs/new");
  const meta = await getCatalogMeta("job");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-navy">Post a job</h1>
      <p className="mt-1 text-sm text-navy/55">Reach people actively looking for work in your community.</p>
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <JobForm meta={meta} />
      </div>
    </div>
  );
}
