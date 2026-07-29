export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <span className="font-mono text-[11px] text-ink-faint">
          © {new Date().getFullYear()} Abrofy — made by people who&apos;ve moved too
        </span>
        <div className="flex items-center gap-5">
          <a href="/terms" className="text-[12px] text-ink-dim transition hover:text-ink">
            Terms
          </a>
          <a href="/privacy" className="text-[12px] text-ink-dim transition hover:text-ink">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
