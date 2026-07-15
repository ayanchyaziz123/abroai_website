import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchServer } from "@/lib/api-server";
import { getCurrentUser } from "@/lib/auth";
import { getCatalogMeta } from "@/lib/catalog";
import { ApiError } from "@/lib/api-error";
import OwnerActions from "@/components/listings/OwnerActions";
import RsvpButton from "@/components/listings/RsvpButton";
import type { EventListing } from "@/types";

const ACCENT = "#E85555";

async function getEvent(id: string): Promise<EventListing | null> {
  try {
    return await fetchServer<EventListing>(`events/${id}/`);
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
  const event = await getEvent(id);
  return { title: event ? event.title : "Event not found" };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, user, meta] = await Promise.all([getEvent(id), getCurrentUser(), getCatalogMeta("event")]);
  if (!event) notFound();

  const category = meta.categories.find((c) => c.key === event.category);
  const isOwner = user?.id === event.posted_by_id;
  const date = new Date(event.date);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {event.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.image_url} alt={event.title} className="h-64 w-full rounded-2xl object-cover sm:h-80" />
      )}

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          {category && (
            <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: `${ACCENT}18`, color: ACCENT }}>
              {category.emoji} {category.label}
            </span>
          )}
          <h1 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl">{event.title}</h1>
          <p className="mt-1 text-sm text-navy/55">By {event.posted_by_name}</p>
        </div>
        {isOwner && (
          <OwnerActions editHref={`/events/${event.id}/edit`} deletePath={`events/${event.id}/`} redirectAfterDelete="/events" />
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-lg bg-black/5 px-3 py-1.5 text-xs font-semibold text-navy/70">
          📅 {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
        </span>
        <span className="rounded-lg bg-black/5 px-3 py-1.5 text-xs font-semibold text-navy/70">
          🕐 {date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
        </span>
        <span
          className="rounded-lg px-3 py-1.5 text-xs font-bold"
          style={{ backgroundColor: event.is_free ? "rgba(40,217,158,0.15)" : "rgba(244,162,39,0.15)", color: event.is_free ? "#28D99E" : "#F4A227" }}
        >
          {event.is_free ? "FREE" : event.price ? `$${event.price}` : "PAID"}
        </span>
        {event.location && (
          <span className="rounded-lg bg-black/5 px-3 py-1.5 text-xs font-semibold text-navy/70">📍 {event.location}</span>
        )}
      </div>

      <div className="mt-6">
        <RsvpButton eventId={event.id} initialRsvped={event.is_rsvped} initialCount={event.rsvp_count} isLoggedIn={!!user} />
      </div>

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <h2 className="text-sm font-bold uppercase tracking-wide text-navy/40">About this event</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-navy/80">{event.description}</p>
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-brand-blue hover:underline"
          >
            Registration link ↗
          </a>
        )}
      </div>

      {event.gallery.length > 1 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {event.gallery.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={img.id} src={img.url} alt="" className="h-28 w-full rounded-xl object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
