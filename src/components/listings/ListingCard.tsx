import Link from "next/link";

export type ListingCardProps = {
  href: string;
  title: string;
  subtitle?: string | null;
  location?: string | null;
  imageUrl?: string | null;
  badge?: string | null;
  accent: string;
  emoji: string;
  meta?: string | null;
};

export default function ListingCard({
  href,
  title,
  subtitle,
  location,
  imageUrl,
  badge,
  accent,
  emoji,
  meta,
}: ListingCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white card-shadow transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative h-40 w-full overflow-hidden" style={{ backgroundColor: `${accent}14` }}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">{emoji}</div>
        )}
        {badge && (
          <span
            className="absolute left-2.5 top-2.5 rounded-md px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white"
            style={{ backgroundColor: accent }}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 text-sm font-bold text-navy">{title}</h3>
        {subtitle && (
          <p className="text-sm font-bold" style={{ color: accent }}>
            {subtitle}
          </p>
        )}
        {location && <p className="mt-0.5 truncate text-xs text-navy/50">📍 {location}</p>}
        {meta && <p className="mt-auto pt-1 text-xs text-navy/40">{meta}</p>}
      </div>
    </Link>
  );
}
