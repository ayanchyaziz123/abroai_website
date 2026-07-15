"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/lib/api-client";
import { Field, inputClass } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import type { User } from "@/types";

export default function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [livesIn, setLivesIn] = useState(user.profile.lives_in || "");
  const [bio, setBio] = useState(user.profile.bio || "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      await fetchClient("auth/me/", {
        method: "PATCH",
        body: JSON.stringify({ first_name: firstName, last_name: lastName, lives_in: livesIn, bio }),
      });
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-brand-red/10 px-3 py-2 text-sm font-medium text-brand-red">{error}</div>}
      {saved && <div className="rounded-lg bg-brand-teal/10 px-3 py-2 text-sm font-medium text-brand-teal">Profile updated.</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name">
          <input className={inputClass} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </Field>
        <Field label="Last name">
          <input className={inputClass} value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </Field>
      </div>
      <Field label="Currently living in">
        <input className={inputClass} value={livesIn} onChange={(e) => setLivesIn(e.target.value)} />
      </Field>
      <Field label="Bio">
        <textarea className={`${inputClass} min-h-24`} value={bio} onChange={(e) => setBio(e.target.value)} />
      </Field>

      <Button type="submit" loading={saving}>
        Save changes
      </Button>
    </form>
  );
}
