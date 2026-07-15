import Link from "next/link";

const CATEGORIES = [
  {
    href: "/jobs",
    label: "Jobs",
    color: "var(--type-job)",
    desc: "Employers who sponsor visas and hire newcomers.",
    emoji: "💼",
  },
  {
    href: "/housing",
    label: "Housing",
    color: "var(--type-housing)",
    desc: "Rooms, apartments, and sublets from your community.",
    emoji: "🏠",
  },
  {
    href: "/marketplace",
    label: "Marketplace",
    color: "var(--type-market)",
    desc: "Buy and sell furniture, electronics, and more.",
    emoji: "🛒",
  },
  {
    href: "/events",
    label: "Events",
    color: "var(--type-event)",
    desc: "Legal aid clinics, job fairs, and meetups near you.",
    emoji: "🎉",
  },
];

const FEATURES = [
  {
    title: "Built for immigrant communities",
    desc: "Every category — jobs, housing, marketplace, events — is designed around the questions newcomers actually ask.",
  },
  {
    title: "Verified & moderated",
    desc: "ID verification, reviews, and admin-reviewed categories keep listings trustworthy.",
  },
  {
    title: "Free to start",
    desc: "Post your first listing for free. Upgrade only if you want more visibility.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_20%_20%,var(--brand-orange),transparent_45%),radial-gradient(circle_at_80%_0%,var(--brand-blue),transparent_40%),radial-gradient(circle_at_50%_100%,var(--brand-teal),transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
              Now on web — same account as the app
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Everything you need to <span className="brand-gradient-text">settle in</span>, in
              one place.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/70">
              Zabroad connects immigrant communities with jobs, housing, marketplace deals, and
              local events — posted by people who&apos;ve been exactly where you are.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/jobs"
                className="inline-flex items-center rounded-xl brand-gradient-bg px-6 py-3 text-sm font-bold text-navy shadow-lg transition hover:opacity-90"
              >
                Browse listings
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Create free account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-navy">Explore by category</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group rounded-2xl border border-black/5 bg-white p-6 card-shadow transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                style={{ backgroundColor: `${cat.color}1a` }}
              >
                {cat.emoji}
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy">{cat.label}</h3>
              <p className="mt-1.5 text-sm text-navy/55">{cat.desc}</p>
              <span
                className="mt-4 inline-flex items-center text-sm font-semibold transition group-hover:gap-1.5"
                style={{ color: cat.color }}
              >
                Browse {cat.label.toLowerCase()} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-navy">Why Zabroad</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <h3 className="text-base font-bold text-navy">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/55">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl brand-gradient-bg px-8 py-14 text-center sm:px-16">
          <h2 className="text-2xl font-extrabold text-navy sm:text-3xl">
            Have something to post?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm font-medium text-navy/70">
            Job openings, a spare room, an old couch, or a community event — it takes less than
            two minutes to post.
          </p>
          <Link
            href="/jobs/new"
            className="mt-6 inline-flex items-center rounded-xl bg-navy px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
          >
            Post a listing
          </Link>
        </div>
      </section>
    </div>
  );
}
