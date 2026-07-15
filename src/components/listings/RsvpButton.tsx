"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/lib/api-client";
import Button from "@/components/ui/Button";

export default function RsvpButton({
  eventId,
  initialRsvped,
  initialCount,
  isLoggedIn,
}: {
  eventId: string;
  initialRsvped: boolean;
  initialCount: number;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [rsvped, setRsvped] = useState(initialRsvped);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!isLoggedIn) {
      router.push(`/login?next=/events/${eventId}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchClient<{ rsvped: boolean; rsvp_count: number }>(`events/${eventId}/rsvp/`, {
        method: "POST",
      });
      setRsvped(res.rsvped);
      setCount(res.rsvp_count);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={rsvped ? "outline" : "primary"}
      loading={loading}
      onClick={handleClick}
      className={rsvped ? "border-brand-teal text-brand-teal" : ""}
    >
      {rsvped ? `✓ Going · ${count}` : `RSVP${count ? ` · ${count} going` : ""}`}
    </Button>
  );
}
