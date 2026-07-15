import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { fetchServer } from "@/lib/api-server";
import { getCatalogMeta } from "@/lib/catalog";
import { ApiError } from "@/lib/api-error";
import EventForm from "@/components/listings/EventForm";
import type { EventListing } from "@/types";

export const metadata: Metadata = { title: "Edit event" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/events/${id}/edit`);

  let event: EventListing;
  try {
    event = await fetchServer<EventListing>(`events/${id}/`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  if (event.posted_by_id !== user.id) redirect(`/events/${id}`);

  const meta = await getCatalogMeta("event");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-navy">Edit event</h1>
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <EventForm meta={meta} event={event} />
      </div>
    </div>
  );
}
