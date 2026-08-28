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

// Matches the mobile app's HomeScreen grid card (gridCard/gridImgWrap/
// gridInfo) — no card box, no border, no fill. Just a rounded image sitting
// on the page, with plain title/subtitle text underneath.
export default function ListingCard({ item, cfg }: { item: ListingItem; cfg: ListingTypeConfig }) {
  const boosted = item.is_hot || item.is_featured;
  const subtitle =
    cfg.key === "job" ? item.company : cfg.hasPrice && item.price != null ? `$${item.price}` : null;

  return (
    <Link href={`/listing?type=${cfg.key}&id=${item.id}`} className="group flex flex-col">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-2">
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
      <div className="flex flex-col gap-0.5 pt-2">
        <h3 className="line-clamp-1 text-[13px] font-semibold leading-snug text-ink">{item.title}</h3>
        {subtitle && <p className="line-clamp-1 text-[12px] text-ink-dim">{subtitle}</p>}
        {item.location && <p className="line-clamp-1 text-[11px] text-ink-faint">{item.location}</p>}
      </div>
    </Link>
  );
}
