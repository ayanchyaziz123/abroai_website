import type { CatalogCategory } from "@/types";

export default function CategoryPicker({
  categories,
  value,
  onChange,
  accent,
}: {
  categories: CatalogCategory[];
  value: string;
  onChange: (key: string) => void;
  accent: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const active = value === cat.key;
        return (
          <button
            type="button"
            key={cat.key}
            onClick={() => onChange(cat.key)}
            className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition"
            style={{
              borderColor: active ? accent : "rgba(0,0,0,0.1)",
              backgroundColor: active ? `${accent}14` : "white",
              color: active ? accent : "var(--foreground)",
            }}
          >
            {cat.emoji && <span>{cat.emoji}</span>}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
