import Image from "next/image";

const ANDROID_APK_URL =
  "https://expo.dev/artifacts/eas/ansR7KfgOpjKNCfey2TitHrJ_UgdTM8sQI_5Kteeoto.apk";

const FEATURES = [
  {
    title: "Jobs & housing",
    desc: "Employers who sponsor visas, and rooms posted by your own community.",
  },
  {
    title: "Marketplace & rides",
    desc: "Buy, sell, and get around — all local, all in one place.",
  },
  {
    title: "Verified lawyers & doctors",
    desc: "Vetted by AbroAI, not user-posted — the professionals you can trust.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_18%_14%,var(--brand-purple),transparent_42%),radial-gradient(circle_at_82%_8%,var(--brand-orange),transparent_38%),radial-gradient(circle_at_50%_100%,var(--brand-purple-2),transparent_45%)]" />

      <main className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center sm:py-28">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[26px] shadow-[0_20px_60px_-15px_rgba(124,58,237,0.6)] ring-1 ring-white/10">
          <Image src="/app-icon.png" alt="AbroAI app icon" width={96} height={96} priority />
        </div>

        <span className="mt-7 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-white/70">
          For immigrant communities, everywhere
        </span>

        <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Get <span className="brand-gradient-text">AbroAI</span>
        </h1>
        <p className="mt-4 max-w-lg text-base text-ink-60 sm:text-lg">
          Jobs, housing, marketplace, and community — everything you need to settle in, in one
          app.
        </p>

        {/* Download buttons */}
        <div className="mt-10 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <a
            href={ANDROID_APK_URL}
            className="group flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 text-navy shadow-[0_12px_30px_-10px_rgba(124,58,237,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(124,58,237,0.65)]"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                d="M17.6 9.48l1.84-3.18a.5.5 0 00-.87-.5l-1.87 3.23a10.9 10.9 0 00-9.4 0L5.43 5.8a.5.5 0 00-.87.5L6.4 9.48A10.06 10.06 0 002 17.5h20a10.06 10.06 0 00-4.4-8.02zM8.5 14.5a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2z"
                fill="#7C3AED"
              />
            </svg>
            <span className="text-left">
              <span className="block text-[11px] font-medium leading-none text-navy/55">
                Download for
              </span>
              <span className="block text-base font-extrabold leading-tight">Android</span>
            </span>
          </a>

          <div
            aria-disabled="true"
            className="flex cursor-not-allowed items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-7 py-4 text-white/40"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
              <path
                d="M16.365 1.43c0 1.14-.462 2.1-1.14 2.85-.75.84-1.98 1.5-3.06 1.41-.15-1.11.42-2.28 1.11-3 .78-.87 2.13-1.5 3.09-1.26zm3.03 16.98c-.51 1.14-.75 1.65-1.41 2.67-.93 1.44-2.25 3.24-3.87 3.27-1.44.03-1.83-.93-3.75-.93s-2.34.9-3.75.96c-1.62.06-2.85-1.56-3.78-3-2.58-4.02-2.85-8.73-1.26-11.25.99-1.59 2.7-2.61 4.44-2.64 1.5-.03 2.85 1.02 3.75 1.02.9 0 2.55-1.26 4.29-1.08.72.03 2.76.3 4.08 2.25-.09.06-2.43 1.44-2.4 4.29.03 3.39 2.97 4.53 3 4.44z"
                fill="currentColor"
              />
            </svg>
            <span className="text-left">
              <span className="block text-[11px] font-medium leading-none text-white/35">
                Coming soon to
              </span>
              <span className="block text-base font-extrabold leading-tight">iOS</span>
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-35">
          Android installs directly via APK — you may need to allow &ldquo;install from unknown
          sources&rdquo; once.
        </p>

        {/* Features */}
        <div className="mt-20 grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <h3 className="text-sm font-bold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-60">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative border-t border-white/10 py-6 text-center text-xs text-ink-35">
        © {new Date().getFullYear()} AbroAI
      </footer>
    </div>
  );
}
