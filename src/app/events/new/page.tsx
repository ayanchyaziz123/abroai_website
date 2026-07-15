import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getCatalogMeta } from "@/lib/catalog";
import EventForm from "@/components/listings/EventForm";

export const metadata: Metadata = { title: "Create an event" };

export default async function NewEventPage() {
  await requireUser("/events/new");
  const meta = await getCatalogMeta("event");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-navy">Create an event</h1>
      <p className="mt-1 text-sm text-navy/55">Share meetups, legal aid clinics, and job fairs with your community.</p>
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <EventForm meta={meta} />
      </div>
    </div>
  );
}
