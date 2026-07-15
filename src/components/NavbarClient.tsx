"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@/types";

export default function NavbarClient({
  user,
  navLinks,
}: {
  user: User | null;
  navLinks: { href: string; label: string }[];
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setMenuOpen(false);
      setLoggingOut(false);
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          <Link
            href="/jobs/new"
            className="hidden sm:inline-flex items-center rounded-lg brand-gradient-bg px-4 py-2 text-sm font-bold text-navy shadow-sm transition hover:opacity-90"
          >
            + Post a listing
          </Link>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-white/85 hover:bg-white/10"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue/90 text-xs font-bold text-white">
                {(user.first_name?.[0] || user.name?.[0] || "U").toUpperCase()}
              </span>
              <span className="hidden lg:inline">{user.first_name || user.name}</span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-black/5 bg-white py-1 text-navy shadow-xl">
                  <Link
                    href="/account"
                    className="block px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    My account
                  </Link>
                  <Link
                    href="/account/listings"
                    className="block px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    My listings
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="block w-full px-4 py-2.5 text-left text-sm font-medium text-brand-red hover:bg-gray-50 disabled:opacity-60"
                  >
                    {loggingOut ? "Signing out…" : "Sign out"}
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/10"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center rounded-lg brand-gradient-bg px-4 py-2 text-sm font-bold text-navy shadow-sm transition hover:opacity-90"
          >
            Sign up
          </Link>
        </>
      )}

      <button
        className="ml-1 rounded-lg p-2 text-white/85 hover:bg-white/10 md:hidden"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {mobileOpen && (
        <div className="absolute inset-x-0 top-16 z-30 border-t border-white/10 bg-navy p-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
