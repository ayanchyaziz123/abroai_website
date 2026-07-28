import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — AbroAI",
  description: "How AbroAI collects, uses, and protects your data.",
};

const LAST_UPDATED = "July 15, 2026";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-ground">
      <div className="pointer-events-none fixed inset-0 [background:radial-gradient(120%_60%_at_50%_-10%,rgba(200,83,47,0.10),transparent)]" />
      <main className="relative mx-auto max-w-2xl px-5 py-16 sm:py-20">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim transition hover:text-ink"
        >
          ← AbroAI
        </Link>

        <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 font-mono text-xs text-ink-faint">Last updated {LAST_UPDATED}</p>

        <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-ink-dim">
          <p>
            AbroAI (&ldquo;AbroAI,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) helps immigrant
            communities find jobs, housing, marketplace listings, rides, events, and verified
            professionals. This policy explains what information we collect through the AbroAI
            app, why we collect it, and the choices you have.
          </p>

          <Section title="Information we collect">
            <SubHeading>Account information</SubHeading>
            <P>
              When you register, we collect your name, email address, and password (stored
              hashed, never in plain text). We verify your email with a one-time code before your
              account is active.
            </P>
            <SubHeading>Profile information</SubHeading>
            <P>
              Your profile can include a handle, bio, home country, current city, and a profile
              or cover photo. This information is visible to other users.
            </P>
            <SubHeading>Listings and content</SubHeading>
            <P>
              Anything you post — job listings, housing listings, marketplace items, service or
              rideshare posts, events, reviews, and messages — is stored so it can be shown to
              other users as intended. Photos you upload to a listing or a chat message are stored
              and served back through the app.
            </P>
            <SubHeading>Location</SubHeading>
            <P>
              If you grant location permission, we use your device&apos;s GPS coordinates to show
              listings near you and to let you set a search location. You can deny this permission
              and manually search by city instead.
            </P>
            <SubHeading>Messages</SubHeading>
            <P>
              Direct messages (including any photos you send in a conversation) are stored so the
              conversation can be delivered to the other participant and remains available when
              you reopen the app.
            </P>
            <SubHeading>Push notification tokens</SubHeading>
            <P>
              If you allow notifications, we store a device push token so we can notify you about
              new messages, listing activity, and account updates. You can disable this at any
              time in your device settings.
            </P>
            <SubHeading>Payment information</SubHeading>
            <P>
              Premium listing upgrades are processed by Stripe. We do not receive or store your
              full card number — Stripe handles payment collection directly and shares with us
              only what&apos;s needed to confirm a payment succeeded (a payment reference and the
              plan purchased).
            </P>
          </Section>

          <Section title="How we use your information">
            <P>We use the information above to:</P>
            <Ul
              items={[
                "Operate the core features of the app — listings, messaging, search, and location-based results.",
                "Process payments for premium listing upgrades.",
                "Send you notifications about messages, listing activity, and account status.",
                "Investigate reports of abuse, fraud, or content that violates our Terms.",
                "Improve the app and diagnose technical issues.",
              ]}
            />
            <P>We do not sell your personal information to third parties.</P>
          </Section>

          <Section title="Who we share information with">
            <Ul
              items={[
                "Other users — your profile, listings, reviews, and any message you send to them.",
                "Stripe — to process payments for premium listings, governed by Stripe's own privacy policy.",
                "Service providers — hosting and infrastructure providers we use to run the app (e.g. our servers and file storage), bound to only use data to provide those services.",
                "Law enforcement or legal process — only where required by law.",
              ]}
            />
          </Section>

          <Section title="Your choices and rights">
            <Ul
              items={[
                "You can edit or delete your profile information, listings, and messages from within the app.",
                "You can disable location and notification permissions at any time in your device settings.",
                "You can request a copy of your data or request account deletion by contacting us at the email below.",
              ]}
            />
          </Section>

          <Section title="Data retention">
            <P>
              We keep your information for as long as your account is active. If you delete your
              account, we remove your profile, listings, and messages within a reasonable period,
              except where we&apos;re required to retain records for legal or fraud-prevention
              purposes.
            </P>
          </Section>

          <Section title="Security">
            <P>
              We use industry-standard measures to protect your data, including encrypted
              connections (HTTPS), hashed passwords, and file-type/size validation on uploads. No
              system is perfectly secure, and we can&apos;t guarantee absolute security.
            </P>
          </Section>

          <Section title="Children's privacy">
            <P>
              AbroAI is not intended for anyone under 18. We do not knowingly collect information
              from children. If you believe a child has provided us information, contact us and
              we will remove it.
            </P>
          </Section>

          <Section title="Changes to this policy">
            <P>
              We may update this policy as the app evolves. We&apos;ll update the &ldquo;Last
              updated&rdquo; date above when we do, and for material changes we&apos;ll make a
              reasonable effort to notify you in-app.
            </P>
          </Section>

          <Section title="Contact us">
            <P>
              Questions about this policy or your data? Email us at{" "}
              <a className="text-accent-soft underline underline-offset-2" href="mailto:azizurusa22@gmail.com">
                azizurusa22@gmail.com
              </a>
              .
            </P>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-4 text-[13px] font-semibold uppercase tracking-wide text-ink">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-accent-soft">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
