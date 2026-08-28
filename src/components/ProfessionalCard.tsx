import Link from "next/link";

export type ProfessionalItem = {
  id: number;
  professional_type: "attorney" | "doctor";
  name: string;
  organization?: string;
  location?: string;
  image_url?: string | null;
  is_verified?: boolean;
  plan?: string;
};

export default function ProfessionalCard({ item, widthClass = "w-44" }: { item: ProfessionalItem; widthClass?: string }) {
  const accent = item.professional_type === "attorney" ? "var(--cat-job)" : "var(--accent)";
  return (
    <Link
      href={`/professional?type=${item.professional_type}&id=${item.id}`}
      className={`group flex ${widthClass} shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:shadow-md`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface-2">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[24px] font-bold text-white" style={{ backgroundColor: accent }}>
            {item.name?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        {item.is_verified && (
          <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
            ✓ Verified
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        <h3 className="line-clamp-1 text-[13.5px] font-semibold text-ink">{item.name}</h3>
        {item.organization && <p className="line-clamp-1 text-[11.5px] text-ink-dim">{item.organization}</p>}
      </div>
    </Link>
  );
}
