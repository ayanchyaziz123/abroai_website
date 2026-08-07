import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const ANDROID_APK_URL =
  "https://expo.dev/artifacts/eas/TltzRBCDoEzGhPttLJG8v6sGDpjVJunw0X0e6cWAtxE.apk";

const STATS = [
  { num: "50K+", label: "neighbors" },
  { num: "80", label: "countries called home" },
  { num: "24/7", label: "always someone here" },
];

// Stand-ins for real community members — initials and a home-country flag,
// the same visual language the app itself already uses for a poster's
// avatar. Deliberately not attributed names or quotes: nothing here claims
// to be a specific real person, just a sense of who's actually on Abrofy.
const MEMBERS = [
  { initials: "MR", flag: "🇧🇩", color: "var(--cat-job)" },
  { initials: "AK", flag: "🇳🇬", color: "var(--cat-housing)" },
  { initials: "SP", flag: "🇮🇳", color: "var(--cat-market)" },
  { initials: "JL", flag: "🇵🇭", color: "var(--cat-ride)" },
  { initials: "FH", flag: "🇪🇬", color: "var(--cat-event)" },
  { initials: "TN", flag: "🇻🇳", color: "var(--accent)" },
  { initials: "CO", flag: "🇬🇭", color: "var(--gold)" },
  { initials: "RM", flag: "🇲🇽", color: "var(--cat-job)" },
];

const FEATURES = [
  { color: "var(--cat-job)", emoji: "💼", title: "Jobs", desc: "Visa-friendly employers and OPT/CPT-eligible roles, posted by people who've been in your shoes." },
  { color: "var(--cat-housing)", emoji: "🏠", title: "Housing", desc: "Rooms and apartments from your own community — no U.S. credit history required." },
  { color: "var(--cat-market)", emoji: "🛍️", title: "Marketplace", desc: "Buy and sell furniture, electronics, and everyday essentials, locally." },
  { color: "var(--cat-ride)", emoji: "🚗", title: "Rideshare", desc: "Split rides and get around your new city without a car of your own." },
  { color: "var(--cat-event)", emoji: "🎉", title: "Events", desc: "Community meetups, legal-aid clinics, and job fairs happening near you." },
  { color: "var(--accent)", emoji: "🩺", title: "Verified lawyers & doctors", desc: "Vetted by Abrofy, not user-posted — the professionals you can actually trust." },
];

// Illustrative situations, not attributed testimonials — the warmth comes
// from specificity, not from manufactured quotes with invented names.
const SCENARIOS = [
  { color: "var(--cat-job)", line: "Landed on OPT with 90 days on the clock and a resume nobody local recognized yet." },
  { color: "var(--cat-housing)", line: "Needed a room by Friday, no U.S. credit history, no cosigner, no idea which neighborhoods were safe." },
  { color: "var(--accent)", line: "Had a real legal question at 11pm and didn't want to gamble on whoever showed up first in a search." },
];

const STEPS = [
  { title: "Create your account", desc: "Sign up free in under a minute — no credit card, no paperwork." },
  { title: "Browse or post", desc: "Find what you need, or share a job, room, or item with your community." },
  { title: "Connect directly", desc: "Message in-app, and lean on verified professionals when it matters most." },
];

// A sample of countries the community already spans — reinforcing the "80
// countries" stat as something visible, not just a number.
const COUNTRIES = [
  "🇧🇩", "🇳🇬", "🇮🇳", "🇵🇭", "🇪🇬", "🇻🇳", "🇬🇭", "🇲🇽", "🇵🇰", "🇨🇴",
  "🇺🇦", "🇰🇪", "🇧🇷", "🇹🇷", "🇮🇩", "🇸🇳", "🇵🇪", "🇪🇹", "🇨🇳", "🇩🇴",
  "🇲🇦", "🇻🇪", "🇬🇹", "🇱🇰", "🇳🇵", "🇭🇹", "🇺🇿", "🇿🇦", "🇦🇫", "🇸🇾",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-ground">
      <Nav />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-16 px-6 pt-14 pb-20 sm:pt-20 sm:pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-dim px-3.5 py-1.5 text-[12.5px] font-semibold text-accent">
              Built by people who&apos;ve made this move
            </span>
            <h1 className="mt-5 font-display text-[2.6rem] leading-[1.1] font-semibold tracking-tight text-ink text-balance sm:text-6xl">
              You don&apos;t have to figure this out alone.
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-dim">
              Abrofy connects immigrants with jobs, housing, marketplace deals, rides, events, and
              vetted professionals — all in one app, all from people who&apos;ve done this move
              before.
            </p>

            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <a
                id="download"
                href={ANDROID_APK_URL}
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-10px_rgba(31,110,82,0.5)] transition hover:bg-ink sm:w-auto"
              >
                <AndroidIcon />
                Download for Android
              </a>
              <div className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-full border border-line px-7 py-3.5 text-sm font-bold text-ink-faint sm:w-auto">
                <AppleIcon />
                iOS — coming soon
              </div>
            </div>
            <p className="mt-3 font-mono text-[11.5px] text-ink-faint">
              Direct APK install — allow &ldquo;unknown sources&rdquo; once, when prompted.
            </p>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <span className="font-display text-xl font-semibold text-ink">{s.num}</span>
                  <span className="text-[13px] text-ink-faint">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: the community itself, standing in for a hero photo we
              don't have — real initials/flags rather than a stock image. */}
          <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-6">
            <div className="grid grid-cols-3 gap-x-5 gap-y-6 sm:gap-x-6 sm:gap-y-8">
              {MEMBERS.map((m, i) => (
                <div
                  key={m.initials}
                  className="relative"
                  style={{ marginTop: i % 3 === 1 ? "1.75rem" : 0 }}
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full text-[15px] font-bold text-white shadow-[0_10px_20px_-8px_rgba(36,31,26,0.35)] sm:h-20 sm:w-20"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.initials}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface text-[13px] shadow-[0_2px_6px_-1px_rgba(36,31,26,0.4)] sm:h-7 sm:w-7 sm:text-sm">
                    {m.flag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sound familiar? ──────────────────────────────────────────── */}
      <section className="bg-surface-2">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
              The first few months are the hardest part
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {SCENARIOS.map((sc) => (
              <div key={sc.line} className="rounded-2xl bg-surface p-6 shadow-[0_10px_24px_-14px_rgba(36,31,26,0.25)]">
                <div className="h-1 w-8 rounded-full" style={{ backgroundColor: sc.color }} />
                <p className="mt-4 font-display text-[16.5px] leading-snug text-ink">{sc.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
            One app, six ways to get settled
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-line bg-surface p-6 transition hover:border-transparent hover:shadow-[0_16px_32px_-16px_rgba(36,31,26,0.25)]">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full text-xl"
                style={{ backgroundColor: `color-mix(in srgb, ${f.color} 16%, transparent)` }}
              >
                {f.emoji}
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
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
              How Abrofy works
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-display text-base font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-dim">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Verified professionals ───────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-10 rounded-3xl bg-surface p-8 shadow-[0_20px_48px_-24px_rgba(36,31,26,0.25)] sm:grid-cols-2 sm:p-12">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-dim px-3 py-1 text-[12px] font-semibold text-gold">
              ✓ Team verified
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Not everything should be user-posted.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-dim">
              Every lawyer and doctor in Abrofy is added and reviewed by our own team — not
              submitted by users like every other listing in the app. When you need real legal or
              medical help, that distinction matters.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {["Immigration attorneys", "Family & general physicians", "Reviewed before listing"].map(
              (item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-surface-2 px-4 py-3">
                  <CheckIcon />
                  <span className="text-[14px] font-medium text-ink">{item}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── Countries represented ────────────────────────────────────── */}
      <section className="bg-surface-2">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-20">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
            80 countries. One community.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-dim">
            Wherever home used to be, chances are someone from there is already on Abrofy.
          </p>
          <div className="mx-auto mt-10 flex max-w-lg flex-wrap justify-center gap-3">
            {COUNTRIES.map((flag, i) => (
              <span
                key={i}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-xl shadow-[0_6px_14px_-8px_rgba(36,31,26,0.3)]"
              >
                {flag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-20 text-center sm:pb-28">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Free to join, ready when you are.
        </h2>
        <a
          href={ANDROID_APK_URL}
          className="mt-7 inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-[0_20px_44px_-16px_rgba(31,110,82,0.55)] transition hover:bg-ink"
        >
          <AndroidIcon />
          Download Abrofy for Android
        </a>
      </section>

      <Footer />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <circle cx="12" cy="12" r="10" fill="var(--accent)" fillOpacity="0.16" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="var(--accent)"
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
