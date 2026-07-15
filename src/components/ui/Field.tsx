export function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-navy/45">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-brand-red">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-navy placeholder:text-navy/35 shadow-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";
