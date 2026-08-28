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

// Matches the mobile app's HomeScreen grid card — no card box, no border,
// no fill. Just a rounded image/avatar with plain text underneath.
export default function ProfessionalCard({ item }: { item: ProfessionalItem }) {
  const accent = item.professional_type === "attorney" ? "var(--cat-job)" : "var(--accent)";
  return (
    <Link href={`/professional?type=${item.professional_type}&id=${item.id}`} className="group flex flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-2">
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
      <div className="flex flex-col gap-0.5 pt-2">
        <h3 className="line-clamp-1 text-[13px] font-semibold text-ink">{item.name}</h3>
        {item.organization && <p className="line-clamp-1 text-[12px] text-ink-dim">{item.organization}</p>}
      </div>
    </Link>
  );
}
