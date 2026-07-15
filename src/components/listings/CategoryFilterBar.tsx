"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CatalogCategory } from "@/types";

export default function CategoryFilterBar({
  categories,
  accent,
}: {
  categories: CatalogCategory[];
  accent: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "";

  function select(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (key) params.set("category", key);
    else params.delete("category");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Chip label="All" active={active === ""} accent={accent} onClick={() => select("")} />
      {categories.map((cat) => (
        <Chip
          key={cat.key}
          label={`${cat.emoji || ""} ${cat.label}`.trim()}
          active={active === cat.key}
          accent={accent}
          onClick={() => select(cat.key)}
        />
      ))}
    </div>
  );
}

function Chip({
  label,
  active,
  accent,
  onClick,
}: {
  label: string;
  active: boolean;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition"
      style={{
        borderColor: active ? accent : "rgba(0,0,0,0.1)",
        backgroundColor: active ? accent : "white",
        color: active ? "white" : "var(--foreground)",
      }}
    >
      {label}
    </button>
  );
}
