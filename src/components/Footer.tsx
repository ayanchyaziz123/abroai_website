import Link from "next/link";

const COLUMNS = [
  {
    title: "Browse",
    links: [
      { href: "/jobs", label: "Jobs" },
      { href: "/housing", label: "Housing" },
      { href: "/marketplace", label: "Marketplace" },
      { href: "/events", label: "Events" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Sign up" },
      { href: "/account", label: "My account" },
    ],
  },
  {
    title: "Post",
    links: [
      { href: "/jobs/new", label: "Post a job" },
      { href: "/housing/new", label: "List a home" },
      { href: "/marketplace/new", label: "Sell something" },
      { href: "/events/new", label: "Create an event" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/5 bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-extrabold brand-gradient-text">Zabroad</span>
            <p className="mt-3 text-sm text-white/55">
              Jobs, housing, marketplace, and events for immigrant communities — built by
              people who&apos;ve been there.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Zabroad. All rights reserved.</p>
          <p>Also available on iOS and Android.</p>
        </div>
      </div>
    </footer>
  );
}
