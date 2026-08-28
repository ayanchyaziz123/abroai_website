import Link from "next/link";
import { ListingTypeConfig } from "@/lib/listingTypes";

export type ListingItem = {
  id: string;
  title: string;
  location?: string;
  image_url?: string | null;
  plan?: string;
  is_hot?: boolean;
  is_featured?: boolean;
  price?: string | number | null;
  company?: string;
};

export default function ListingCard({ item, cfg }: { item: ListingItem; cfg: ListingTypeConfig }) {
  const boosted = item.is_hot || item.is_featured;
  const subtitle =
    cfg.key === "job" ? item.company : cfg.hasPrice && item.price != null ? `$${item.price}` : null;

  return (
    <Link
      href={`/listing?type=${cfg.key}&id=${item.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface-2 transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-2">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-faint" style={{ color: cfg.accent }}>
            <span className="text-[13px] font-medium opacity-60">{cfg.label}</span>
          </div>
        )}
        {boosted && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-black/70 px-2.5 py-1 text-[10.5px] font-semibold text-white backdrop-blur">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink">{item.title}</h3>
        {subtitle && <p className="text-[12.5px] text-ink-dim">{subtitle}</p>}
        {item.location && <p className="text-[11.5px] text-ink-faint">{item.location}</p>}
      </div>
    </Link>
  );
}
