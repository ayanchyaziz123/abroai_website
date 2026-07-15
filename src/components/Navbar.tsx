import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import NavbarClient from "./NavbarClient";

const NAV_LINKS = [
  { href: "/jobs", label: "Jobs", color: "text-type-job" },
  { href: "/housing", label: "Housing", color: "text-type-housing" },
  { href: "/marketplace", label: "Marketplace", color: "text-type-market" },
  { href: "/events", label: "Events", color: "text-type-event" },
];

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 bg-navy text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-extrabold tracking-tight brand-gradient-text">
            Zabroad
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <NavbarClient user={user} navLinks={NAV_LINKS} />
      </div>
    </header>
  );
}
