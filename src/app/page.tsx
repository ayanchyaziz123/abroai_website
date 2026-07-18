import Image from "next/image";

const ANDROID_APK_URL =
  "https://expo.dev/artifacts/eas/TltzRBCDoEzGhPttLJG8v6sGDpjVJunw0X0e6cWAtxE.apk";

const STATS = [
  { num: "50K+", label: "Members" },
  { num: "80", label: "Countries" },
  { num: "24/7", label: "AI support" },
];

const FEATURES = [
  {
    color: "var(--cat-job)",
    icon: "briefcase",
    title: "Jobs",
    desc: "Visa-friendly employers and OPT/CPT-eligible roles, posted by people who've been in your shoes.",
  },
  {
    color: "var(--cat-housing)",
    icon: "home",
    title: "Housing",
    desc: "Rooms and apartments from your own community — no U.S. credit history required.",
  },
  {
    color: "var(--cat-market)",
    icon: "market",
    title: "Marketplace",
    desc: "Buy and sell furniture, electronics, and everyday essentials, locally.",
  },
  {
    color: "var(--cat-ride)",
    icon: "car",
    title: "Rideshare",
    desc: "Split rides and get around your new city without a car of your own.",
  },
  {
    color: "var(--cat-event)",
    icon: "calendar",
    title: "Events",
    desc: "Community meetups, legal-aid clinics, and job fairs happening near you.",
  },
  {
    color: "var(--cat-verified)",
    icon: "shield",
    title: "Verified lawyers & doctors",
    desc: "Vetted by AbroAI, not user-posted — the professionals you can actually trust.",
  },
];

const STEPS = [
  {
    title: "Create your account",
    desc: "Sign up free in under a minute — no credit card, no paperwork.",
  },
  {
    title: "Browse or post",
    desc: "Find what you need, or share a job, room, or item with your community.",
  },
  {
    title: "Connect directly",
    desc: "Message in-app, and lean on verified professionals when it matters most.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-ground">
      <Nav />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(80%_50%_at_50%_0%,rgba(124,58,237,0.10),transparent)]" />
        <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-20">
          <span className="inline-flex items-center rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim shadow-[0_1px_2px_rgba(26,26,31,0.04)]">
            Built for immigrant communities
          </span>
          <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-ink text-balance sm:text-6xl">
            Everything you need to build a life{" "}
            <span className="brand-gradient-text">abroad.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ink-dim">
            AbroAI connects immigrants with jobs, housing, marketplace deals, rides, events, and
            vetted professionals — all in one app, all in your own community.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              id="download"
              href={ANDROID_APK_URL}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-ink px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(26,26,31,0.35)] transition hover:opacity-90 sm:w-auto"
            >
              <AndroidIcon />
              Download for Android
            </a>
            <div className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-xl border border-line bg-surface px-7 py-3.5 text-sm font-bold text-ink-faint sm:w-auto">
              <AppleIcon />
              iOS — coming soon
            </div>
          </div>
          <p className="mt-3 font-mono text-[11px] text-ink-faint">
            Direct APK install — allow &ldquo;unknown sources&rdquo; once, when prompted.
          </p>

          <div className="mx-auto mt-14 grid max-w-md grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface shadow-[0_2px_16px_-4px_rgba(26,26,31,0.06)]">
            {STATS.map((s) => (
              <div key={s.label} className="px-2 py-5 text-center">
                <div className="font-display text-xl font-semibold text-ink sm:text-2xl">
                  {s.num}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-lg text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
            What&apos;s inside
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
            One app, six ways to get settled
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-line bg-surface p-6 shadow-[0_2px_12px_-6px_rgba(26,26,31,0.08)] transition hover:-translate-y-0.5 hover:border-[color:var(--card-color)] hover:shadow-[0_10px_24px_-10px_var(--card-color)]"
              style={{ ["--card-color" as string]: f.color }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `color-mix(in srgb, ${f.color} 16%, transparent)` }}
              >
                <FeatureIcon name={f.icon} color={f.color} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-dim">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="border-y border-line bg-surface-2">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-lg text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
              Getting started
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
              How AbroAI works
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-display text-sm font-semibold text-accent-soft">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-dim">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Verified professionals callout ──────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 items-center gap-10 rounded-3xl border border-line bg-surface p-8 shadow-[0_4px_24px_-8px_rgba(26,26,31,0.08)] sm:grid-cols-2 sm:p-12">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--cat-verified)]/40 bg-[color:var(--cat-verified)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-[color:var(--cat-verified)]">
              Admin-reviewed
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Not everything should be user-posted.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">
              Every lawyer and doctor in AbroAI is added and reviewed by our own team — not
              submitted by users like every other listing in the app. When you need real legal or
              medical help, that distinction matters.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {["Immigration attorneys", "Family & general physicians", "Reviewed before listing"].map(
              (item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3">
                  <CheckIcon />
                  <span className="text-[14px] font-medium text-ink">{item}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-4 text-center sm:pb-28">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Ready when you are.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-dim">
          Free to join. Takes less than a minute to get started.
        </p>
        <a
          href={ANDROID_APK_URL}
          className="mt-7 inline-flex items-center justify-center gap-2.5 rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-[0_16px_40px_-12px_rgba(124,58,237,0.55)] transition hover:opacity-90"
        >
          <AndroidIcon />
          Download AbroAI for Android
        </a>
      </section>

      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 overflow-hidden rounded-lg">
          <Image src="/app-icon.png" alt="" width={32} height={32} />
        </div>
        <span className="font-display text-lg font-semibold text-ink">AbroAI</span>
      </div>
      <a
        href="#download"
        className="rounded-lg border border-line bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-ink-dim shadow-[0_1px_2px_rgba(26,26,31,0.04)] transition hover:text-ink"
      >
        Get the app
      </a>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <span className="font-mono text-[11px] text-ink-faint">
          © {new Date().getFullYear()} AbroAI
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

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <circle cx="12" cy="12" r="10" fill="var(--cat-verified)" fillOpacity="0.18" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="var(--cat-verified)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M17.6 9.48l1.84-3.18a.5.5 0 00-.87-.5l-1.87 3.23a10.9 10.9 0 00-9.4 0L5.43 5.8a.5.5 0 00-.87.5L6.4 9.48A10.06 10.06 0 002 17.5h20a10.06 10.06 0 00-4.4-8.02zM8.5 14.5a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path
        d="M16.365 1.43c0 1.14-.462 2.1-1.14 2.85-.75.84-1.98 1.5-3.06 1.41-.15-1.11.42-2.28 1.11-3 .78-.87 2.13-1.5 3.09-1.26zm3.03 16.98c-.51 1.14-.75 1.65-1.41 2.67-.93 1.44-2.25 3.24-3.87 3.27-1.44.03-1.83-.93-3.75-.93s-2.34.9-3.75.96c-1.62.06-2.85-1.56-3.78-3-2.58-4.02-2.85-8.73-1.26-11.25.99-1.59 2.7-2.61 4.44-2.64 1.5-.03 2.85 1.02 3.75 1.02.9 0 2.55-1.26 4.29-1.08.72.03 2.76.3 4.08 2.25-.09.06-2.43 1.44-2.4 4.29.03 3.39 2.97 4.53 3 4.44z"
        fill="currentColor"
      />
    </svg>
  );
}

function FeatureIcon({ name, color }: { name: string; color: string }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none" as const };
  switch (name) {
    case "briefcase":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" stroke={color} strokeWidth="1.8" />
          <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke={color} strokeWidth="1.8" />
          <path d="M3 12h18" stroke={color} strokeWidth="1.8" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M4 11l8-7 8 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10v9a1 1 0 001 1h10a1 1 0 001-1v-9" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "market":
      return (
        <svg {...common}>
          <path d="M4 8l1.5-4h13L20 8" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
          <rect x="4" y="8" width="16" height="12" rx="1.5" stroke={color} strokeWidth="1.8" />
          <path d="M9 12a3 3 0 006 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "car":
      return (
        <svg {...common}>
          <path d="M4 16V12l2-5h12l2 5v4" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
          <rect x="3" y="16" width="18" height="4" rx="1" stroke={color} strokeWidth="1.8" />
          <circle cx="7.5" cy="20" r="1.4" fill={color} />
          <circle cx="16.5" cy="20" r="1.4" fill={color} />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="1.8" />
          <path d="M3 10h18" stroke={color} strokeWidth="1.8" />
          <path d="M8 3v4M16 3v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path
            d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}
