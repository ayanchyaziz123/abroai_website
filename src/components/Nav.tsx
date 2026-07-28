import Image from "next/image";

export default function Nav() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 overflow-hidden rounded-lg">
          <Image src="/app-icon.png" alt="" width={32} height={32} />
        </div>
        <span className="font-display text-lg font-semibold text-ink">AbroAI</span>
      </div>
      <a
        href="/#download"
        className="rounded-lg border border-line bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-ink-dim shadow-[0_1px_2px_rgba(43,33,24,0.05)] transition hover:text-ink"
      >
        Get the app
      </a>
    </header>
  );
}
