import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const ANDROID_APK_URL =
  "https://expo.dev/artifacts/eas/TltzRBCDoEzGhPttLJG8v6sGDpjVJunw0X0e6cWAtxE.apk";

const STATS = [
  { num: "50K+", label: "neighbors" },
  { num: "80", label: "countries called home" },
  { num: "24/7", label: "always someone here" },
];

// Small illustrative example listings, styled as physical cards pinned to
// a board next to the hero copy — shows what's actually inside the app
// instead of an abstract stat card or a stock hero photo. Not attributed
// to real people; each is labeled by category, not a fake name.
const PINNED_EXAMPLES = [
  { color: "var(--cat-job)", rotate: "-3deg", emoji: "💼", title: "Line cook, Astoria", meta: "Visa sponsorship possible" },
  { color: "var(--cat-housing)", rotate: "2.5deg", emoji: "🏠", title: "Room in 2BR", meta: "No credit history needed" },
  { color: "var(--cat-event)", rotate: "-1.5deg", emoji: "🎉", title: "Job fair, Saturday", meta: "12 going" },
];

const FEATURES = [
  { color: "var(--cat-job)", emoji: "💼", title: "Jobs", desc: "Visa-friendly employers and OPT/CPT-eligible roles, posted by people who've been in your shoes.", rotate: "-1.5deg" },
  { color: "var(--cat-housing)", emoji: "🏠", title: "Housing", desc: "Rooms and apartments from your own community — no U.S. credit history required.", rotate: "1deg" },
  { color: "var(--cat-market)", emoji: "🛍️", title: "Marketplace", desc: "Buy and sell furniture, electronics, and everyday essentials, locally.", rotate: "-1deg" },
  { color: "var(--cat-ride)", emoji: "🚗", title: "Rideshare", desc: "Split rides and get around your new city without a car of your own.", rotate: "1.5deg" },
  { color: "var(--cat-event)", emoji: "🎉", title: "Events", desc: "Community meetups, legal-aid clinics, and job fairs happening near you.", rotate: "-2deg" },
  { color: "var(--cat-verified)", emoji: "🩺", title: "Verified lawyers & doctors", desc: "Vetted by Abrofy, not user-posted — the professionals you can actually trust.", rotate: "1deg" },
];

// Illustrative situations, not attributed testimonials — the warmth comes
// from specificity, not from manufactured quotes with invented names.
const SCENARIOS = [
  { color: "var(--cat-job)", line: "Landed on OPT with 90 days on the clock and a resume nobody local recognized yet.", rotate: "-2deg" },
  { color: "var(--cat-housing)", line: "Needed a room by Friday, no U.S. credit history, no cosigner, no idea which neighborhoods were safe.", rotate: "1.5deg" },
  { color: "var(--cat-verified)", line: "Had a real legal question at 11pm and didn't want to gamble on whoever showed up first in a search.", rotate: "-1deg" },
];

const STEPS = [
  { title: "Create your account", desc: "Sign up free in under a minute — no credit card, no paperwork." },
  { title: "Browse or post", desc: "Find what you need, or share a job, room, or item with your community." },
  { title: "Connect directly", desc: "Message in-app, and lean on verified professionals when it matters most." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-ground">
      <Nav />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="paper-grain relative overflow-hidden border-b border-line">
        <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-14 px-6 pt-16 pb-20 sm:pt-24 sm:pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left: the note itself */}
          <div>
            <span className="font-hand text-2xl text-accent">Hey —</span>
            <h1 className="mt-2 font-display text-[2.5rem] font-semibold italic leading-[1.08] tracking-tight text-ink text-balance sm:text-5xl">
              you don&apos;t have to figure this out alone.
            </h1>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-dim">
              Abrofy connects immigrants with jobs, housing, marketplace deals, rides, events, and
              vetted professionals — all in one app, all from people who&apos;ve done this move
              before.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <a
                id="download"
                href={ANDROID_APK_URL}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-ink px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(43,33,24,0.35)] transition hover:-rotate-1 hover:opacity-90 sm:w-auto"
              >
                <AndroidIcon />
                Download for Android
              </a>
              <div className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-2xl border border-line bg-surface px-7 py-3.5 text-sm font-bold text-ink-faint sm:w-auto">
                <AppleIcon />
                iOS — coming soon
              </div>
            </div>
            <p className="mt-3 font-mono text-[11px] text-ink-faint">
              Direct APK install — allow &ldquo;unknown sources&rdquo; once, when prompted.
            </p>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-2">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <span className="font-display text-lg font-semibold text-ink">{s.num}</span>
                  <span className="text-[12.5px] text-ink-faint">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: pinned examples of what's actually inside the app */}
          <div className="relative mx-auto flex w-full max-w-xs flex-col gap-7 py-4 sm:max-w-sm">
            {PINNED_EXAMPLES.map((ex) => (
              <div
                key={ex.title}
                className="relative rounded-lg border border-line bg-surface px-5 py-4 shadow-[0_10px_20px_-8px_rgba(43,33,24,0.25)]"
                style={{ transform: `rotate(${ex.rotate})`, ["--pin-color" as string]: ex.color }}
              >
                <span className="pin-dot" />
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-base"
                    style={{ backgroundColor: `color-mix(in srgb, ${ex.color} 20%, transparent)` }}
                  >
                    {ex.emoji}
                  </span>
                  <div>
                    <p className="font-display text-[15px] font-semibold text-ink">{ex.title}</p>
                    <p className="text-[12.5px] text-ink-dim">{ex.meta}</p>
                  </div>
                </div>
              </div>
            ))}
            <p className="font-hand mt-1 text-center text-lg text-ink-faint">
              a few things people posted this week
            </p>
          </div>
        </div>
      </section>

      {/* ── Sound familiar? ──────────────────────────────────────────── */}
      <section className="bg-board">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-lg text-center">
            <span className="font-hand text-2xl text-ink">sound familiar?</span>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
              The first few months are the hardest part
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3">
            {SCENARIOS.map((sc) => (
              <div
                key={sc.line}
                className="relative rounded-sm bg-surface px-5 py-6 shadow-[0_10px_18px_-8px_rgba(43,33,24,0.3)]"
                style={{ transform: `rotate(${sc.rotate})` }}
              >
                <span className="tape-strip" />
                <div className="h-1 w-8 rounded-full" style={{ backgroundColor: sc.color }} />
                <p className="mt-4 font-display text-[16.5px] italic leading-snug text-ink">
                  {sc.line}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features (corkboard) ─────────────────────────────────────── */}
      <section className="paper-grain relative mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-lg text-center">
          <span className="font-hand text-2xl text-accent">what&apos;s inside</span>
          <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
            One app, six ways to get settled
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="relative rounded-lg p-6 transition hover:!rotate-0"
              style={{
                backgroundColor: `color-mix(in srgb, ${f.color} 11%, var(--surface))`,
                boxShadow: `0 10px 20px -10px color-mix(in srgb, ${f.color} 45%, transparent)`,
                transform: `rotate(${f.rotate})`,
                ["--pin-color" as string]: f.color,
              }}
            >
              <span className="pin-dot" />
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full text-xl"
                style={{ backgroundColor: `color-mix(in srgb, ${f.color} 22%, transparent)` }}
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
            <span className="font-hand text-2xl text-accent">getting started</span>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
              How Abrofy works
            </h2>
          </div>

          <div className="relative mt-16">
            {/* Hand-drawn connecting path — a wavy dashed line instead of
                a straight corporate connector. Hidden on mobile where the
                steps stack vertically and a horizontal path reads oddly. */}
            <svg
              className="pointer-events-none absolute left-0 right-0 top-[18px] hidden w-full sm:block"
              height="24"
              viewBox="0 0 600 24"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M40 12 C 150 -6, 250 30, 300 12 S 470 -6, 560 12"
                stroke="var(--accent)"
                strokeOpacity="0.35"
                strokeWidth="2"
                strokeDasharray="1 9"
                strokeLinecap="round"
              />
            </svg>

            <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.title}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-hand text-lg font-bold text-white shadow-[0_4px_10px_-2px_rgba(200,83,47,0.5)]">
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
        </div>
      </section>

      {/* ── Verified professionals callout ──────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="relative grid grid-cols-1 items-center gap-10 rounded-2xl border border-line bg-surface p-8 shadow-[0_10px_30px_-12px_rgba(43,33,24,0.18)] sm:grid-cols-2 sm:p-12">
          {/* Rubber-stamp mark instead of a bordered "trust card" — angled,
              double-ringed, ink-colored — reads as authenticated by hand
              rather than a SaaS trust badge. */}
          <div
            className="absolute -top-6 right-6 flex h-20 w-20 -rotate-12 items-center justify-center rounded-full border-2 border-dashed text-center sm:right-10"
            style={{ borderColor: "var(--cat-verified)", color: "var(--cat-verified)" }}
          >
            <span className="font-display text-[10px] font-bold uppercase leading-tight tracking-wider">
              Team
              <br />
              Verified
            </span>
          </div>

          <div>
            <span className="font-hand text-2xl" style={{ color: "var(--cat-verified)" }}>
              not everything should be user-posted
            </span>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              We check these ones ourselves.
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
        <span className="font-hand text-xl text-ink-dim">P.S. —</span>
        <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          free to join, ready when you are.
        </h2>
        <a
          href={ANDROID_APK_URL}
          className="mt-7 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-[0_16px_40px_-12px_rgba(200,83,47,0.55)] transition hover:-rotate-1 hover:opacity-90"
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
