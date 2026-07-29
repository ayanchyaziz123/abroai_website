import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Abrofy",
  description: "The terms that govern your use of Abrofy.",
};

const LAST_UPDATED = "July 15, 2026";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-ground">
      <div className="pointer-events-none fixed inset-0 [background:radial-gradient(120%_60%_at_50%_-10%,rgba(200,83,47,0.10),transparent)]" />
      <main className="relative mx-auto max-w-2xl px-5 py-16 sm:py-20">
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim transition hover:text-ink"
        >
          ← Abrofy
        </Link>

        <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-3 font-mono text-xs text-ink-faint">Last updated {LAST_UPDATED}</p>

        <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-ink-dim">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of Abrofy (the
            &ldquo;App&rdquo;). By creating an account or using the App, you agree to these Terms.
            If you don&apos;t agree, please don&apos;t use Abrofy.
          </p>

          <Section title="1. Who can use Abrofy">
            <P>
              You must be at least 18 years old and able to form a binding contract to use Abrofy.
              You&apos;re responsible for keeping your account credentials secure and for
              everything that happens under your account.
            </P>
          </Section>

          <Section title="2. What Abrofy is">
            <P>
              Abrofy is a community platform connecting immigrants with job listings, housing,
              marketplace items, rideshare, local events, and a directory of verified lawyers and
              doctors. Except for the lawyer/doctor directory (which is curated by Abrofy through
              manual admin review), all listings are posted by users, not by Abrofy. We don&apos;t
              own, inspect, or guarantee any listing, job offer, housing arrangement, item for
              sale, or service before it&apos;s posted.
            </P>
          </Section>

          <Section title="3. Your content">
            <P>
              You keep ownership of anything you post — listings, photos, messages, reviews. By
              posting, you grant Abrofy a license to store, display, and distribute that content
              within the App as needed to operate the service (for example, showing your listing
              to other users, or delivering your message to its recipient).
            </P>
            <P>You&apos;re responsible for what you post. Content must not:</P>
            <Ul
              items={[
                "Be false, fraudulent, or misleading (e.g. a fake job offer or a housing listing you don't control).",
                "Violate any law, or infringe someone else's rights (including intellectual property or privacy).",
                "Contain harassment, hate speech, or threats.",
                "Advertise anything illegal, or facilitate scams, discrimination, or exploitation of vulnerable people.",
                "Impersonate another person or misrepresent your identity, qualifications, or credentials.",
              ]}
            />
            <P>
              We may remove content or suspend accounts that violate these Terms, based on our own
              review or user reports.
            </P>
          </Section>

          <Section title="4. ID verification">
            <P>
              ID verification is optional. Submitting a government ID doesn&apos;t guarantee
              approval, and a &ldquo;verified&rdquo; badge reflects that an admin reviewed your
              document — it is not a background check and doesn&apos;t guarantee the accuracy of
              anything else in your profile or listings.
            </P>
          </Section>

          <Section title="5. Verified professionals (lawyers & doctors)">
            <P>
              Attorneys and doctors listed in the App are added and reviewed by Abrofy
              administrators, not posted by the professionals themselves or by other users. We
              make reasonable efforts to confirm these listings are accurate at the time they&apos;re
              added, but Abrofy is not a law firm or medical provider, doesn&apos;t provide legal
              or medical advice, and connecting with someone through this directory doesn&apos;t
              create a professional relationship with Abrofy. Always independently verify
              credentials before relying on any professional you find through the App.
            </P>
          </Section>

          <Section title="6. Payments and listing plans">
            <P>
              Some listing features (increased visibility, longer duration, boosted placement) are
              paid upgrades processed through Stripe. Prices are shown before you pay. Payments
              for listing upgrades are generally non-refundable once the upgrade has been applied,
              except where required by law or at our discretion.
            </P>
          </Section>

          <Section title="7. Prohibited conduct">
            <P>You agree not to:</P>
            <Ul
              items={[
                "Use the App for any unlawful purpose.",
                "Scrape, reverse-engineer, or interfere with the App's normal operation.",
                "Create multiple accounts to evade a suspension or ban.",
                "Attempt to bypass content moderation, rate limits, or payment verification.",
                "Use another user's account without permission.",
              ]}
            />
          </Section>

          <Section title="8. Termination">
            <P>
              You can delete your account at any time. We may suspend or terminate accounts that
              violate these Terms, engage in fraud, or pose a risk to other users, with or without
              notice depending on severity.
            </P>
          </Section>

          <Section title="9. Disclaimers">
            <P>
              Abrofy is provided &ldquo;as is.&rdquo; We don&apos;t guarantee that any job, housing
              arrangement, item, ride, event, or professional referral you find through the App
              will meet your expectations, or that the App will be uninterrupted or error-free.
              You&apos;re responsible for exercising your own judgment — including verifying
              anyone you meet through the App — before entering into any agreement, transaction,
              or in-person meeting arranged through Abrofy.
            </P>
          </Section>

          <Section title="10. Limitation of liability">
            <P>
              To the fullest extent permitted by law, Abrofy is not liable for any indirect,
              incidental, or consequential damages arising from your use of the App, including
              disputes between users, the accuracy of listings, or interactions arranged through
              the App.
            </P>
          </Section>

          <Section title="11. Changes to these Terms">
            <P>
              We may update these Terms as the App evolves. We&apos;ll update the &ldquo;Last
              updated&rdquo; date above, and for material changes we&apos;ll make a reasonable
              effort to notify you in-app. Continuing to use Abrofy after changes take effect
              means you accept the updated Terms.
            </P>
          </Section>

          <Section title="12. Contact us">
            <P>
              Questions about these Terms? Email us at{" "}
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
