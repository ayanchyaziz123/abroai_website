import Link from "next/link";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import ProfileForm from "@/components/account/ProfileForm";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await requireUser("/account");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold text-navy">My account</h1>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <span className="flex h-14 w-14 items-center justify-center rounded-full brand-gradient-bg text-lg font-extrabold text-navy">
          {(user.first_name?.[0] || user.name?.[0] || "U").toUpperCase()}
        </span>
        <div>
          <p className="text-base font-bold text-navy">{user.name}</p>
          <p className="text-sm text-navy/50">@{user.profile.handle}</p>
          <p className="text-sm text-navy/50">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <span className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-semibold text-navy/70">
          {user.profile.country_flag} {user.profile.home_country}
        </span>
        <span className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-semibold text-navy/70">
          📍 {user.profile.lives_in}
        </span>
      </div>

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy/40">Edit profile</h2>
        <ProfileForm user={user} />
      </div>

      <Link
        href="/account/listings"
        className="mt-6 flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 card-shadow transition hover:shadow-md"
      >
        <div>
          <p className="text-sm font-bold text-navy">My listings</p>
          <p className="text-xs text-navy/50">Manage everything you&apos;ve posted</p>
        </div>
        <span className="text-navy/40">→</span>
      </Link>
    </div>
  );
}
