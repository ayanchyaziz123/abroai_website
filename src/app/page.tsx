const ANDROID_APK_URL =
  "https://expo.dev/artifacts/eas/ansR7KfgOpjKNCfey2TitHrJ_UgdTM8sQI_5Kteeoto.apk";

const FEATURES = [
  {
    label: "Jobs & housing",
    desc: "Employers who sponsor visas, rooms posted by your own community.",
  },
  {
    label: "Marketplace & rides",
    desc: "Buy, sell, and get around — all local, all in one app.",
  },
  {
    label: "Verified lawyers & doctors",
    desc: "Vetted by AbroAI, not user-posted — professionals you can trust.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-ground">
      {/* Faint ground texture — a wash of light from the top, like an
          airport departures board glow, not a rounded gradient blob. */}
      <div className="pointer-events-none fixed inset-0 [background:radial-gradient(120%_60%_at_50%_-10%,rgba(124,58,237,0.14),transparent)]" />

      <main className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 sm:py-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim">
          One app · Two continents
        </span>
        <h1 className="mt-4 w-full max-w-lg text-center font-display text-[2.75rem] leading-[1.05] font-semibold tracking-tight text-ink sm:text-6xl">
          Your next chapter,{" "}
          <span className="italic font-normal text-accent-soft">boarding now.</span>
        </h1>
        <p className="mt-5 w-full max-w-md text-center text-[15px] leading-relaxed text-ink-dim">
          Jobs, housing, marketplace, and verified help — everything for landing somewhere new,
          in one app.
        </p>

        {/* Boarding pass */}
        <div className="relative mt-20 w-full">
          {/* Stamp */}
          <div
            className="absolute -right-4 -top-16 z-10 hidden h-20 w-20 rotate-[9deg] items-center justify-center rounded-full border-2 border-dashed border-stamp/70 text-center sm:flex"
            aria-hidden="true"
          >
            <span className="font-mono text-[8.5px] font-medium uppercase leading-tight tracking-widest text-stamp">
              Ready for
              <br />
              takeoff
            </span>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-line bg-paper shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
            {/* Top: identity strip */}
            <div className="flex items-center justify-between px-6 pt-6 sm:px-8 sm:pt-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                Boarding Pass
              </span>
              <span className="font-display text-base font-semibold text-ink">AbroAI</span>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 px-6 py-7 sm:px-8">
              <Field label="Passenger" value="You" />
              <Field label="Class" value="Community" align="right" />
              <Field label="From" value="Wherever you are" />
              <Field label="To" value="Wherever you're headed" align="right" />
            </div>

            {/* Perforation */}
            <div className="relative px-0">
              <div className="perforation" />
            </div>

            {/* Stub: gates / downloads */}
            <div className="px-6 py-7 sm:px-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
                Select a gate
              </span>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href={ANDROID_APK_URL}
                  className="group flex flex-1 items-center justify-between rounded-xl border border-accent/40 bg-accent/10 px-5 py-4 transition hover:border-accent hover:bg-accent/15"
                >
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-accent-soft">
                      Gate A · Open
                    </span>
                    <span className="mt-0.5 block font-display text-lg font-semibold text-ink">
                      Android
                    </span>
                  </span>
                  <span className="font-mono text-xs text-accent-soft transition group-hover:translate-x-0.5">
                    ↓ APK
                  </span>
                </a>

                <div className="flex flex-1 items-center justify-between rounded-xl border border-dashed border-line px-5 py-4">
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                      Gate B · Pending
                    </span>
                    <span className="mt-0.5 block font-display text-lg font-semibold text-ink-dim">
                      iOS
                    </span>
                  </span>
                  <span className="font-mono text-xs text-ink-faint">soon</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-ink-faint">
                Android installs directly via APK — allow &ldquo;install from unknown
                sources&rdquo; once, when prompted.
              </p>
              <div className="barcode mt-6 h-8 w-full" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid w-full grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {FEATURES.map((f) => (
            <div key={f.label} className="px-1 py-5 sm:px-6">
              <h3 className="font-display text-[15px] font-semibold text-ink">{f.label}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-dim">{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 font-mono text-[11px] text-ink-faint">
          © {new Date().getFullYear()} AbroAI
        </p>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  align = "left",
}: {
  label: string;
  value: string;
  align?: "left" | "right";
}) {
  return (
    <div className={`min-w-0 ${align === "right" ? "text-right" : "text-left"}`}>
      <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim">
        {label}
      </span>
      <span className="mt-1 block font-display text-[15px] text-ink break-words">{value}</span>
    </div>
  );
}
