"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function Nav() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="h-8 w-8 overflow-hidden rounded-xl">
          <Image src="/app-icon.png" alt="" width={32} height={32} />
        </div>
        <span className="font-display text-lg font-semibold text-ink">Abrofy</span>
      </Link>

      <nav className="flex items-center gap-5">
        <Link href="/browse" className="text-[13px] font-medium text-ink-dim transition hover:text-ink">
          Browse
        </Link>

        {!loading && user && (
          <Link href="/post" className="text-[13px] font-medium text-ink-dim transition hover:text-ink">
            Create
          </Link>
        )}

        {!loading && user ? (
          <button
            onClick={logout}
            className="text-[13px] font-medium text-ink-dim transition hover:text-ink"
          >
            Log out
          </button>
        ) : !loading ? (
          <Link href="/login" className="text-[13px] font-medium text-ink-dim transition hover:text-ink">
            Log in
          </Link>
        ) : null}

        <a
          href="https://expo.dev/artifacts/eas/TltzRBCDoEzGhPttLJG8v6sGDpjVJunw0X0e6cWAtxE.apk"
          className="rounded-full bg-accent px-5 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-90"
        >
          Get the app
        </a>
      </nav>
    </header>
  );
}
