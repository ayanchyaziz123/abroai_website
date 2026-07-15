import type { CatalogPlan } from "@/types";

export default function PlanPicker({
  plans,
  value,
  onChange,
}: {
  plans: CatalogPlan[];
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {plans.map((p) => {
        const active = value === p.key;
        const accent = p.color || "var(--brand-blue)";
        return (
          <button
            type="button"
            key={p.key}
            onClick={() => onChange(p.key)}
            className="relative flex flex-col rounded-2xl border p-4 text-left transition"
            style={{
              borderColor: active ? accent : "rgba(0,0,0,0.08)",
              backgroundColor: active ? `${accent}0f` : "white",
            }}
          >
            {p.badge && (
              <span
                className="absolute -top-2.5 right-4 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase text-white"
                style={{ backgroundColor: accent }}
              >
                {p.badge}
              </span>
            )}
            <div className="flex items-center gap-2">
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full border-2"
                style={{ borderColor: active ? accent : "rgba(0,0,0,0.2)", backgroundColor: active ? accent : "transparent" }}
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span className="text-sm font-extrabold text-navy">{p.label}</span>
            </div>
            <span className="mt-1 text-lg font-extrabold" style={{ color: accent }}>
              {p.price}
            </span>
            <ul className="mt-3 space-y-1.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-xs text-navy/60">
                  <span style={{ color: accent }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}
