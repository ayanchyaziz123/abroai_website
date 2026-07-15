"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchClient } from "@/lib/api-client";
import Button from "@/components/ui/Button";

export default function OwnerActions({
  editHref,
  deletePath,
  redirectAfterDelete,
}: {
  editHref: string;
  deletePath: string;
  redirectAfterDelete: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetchClient(deletePath, { method: "DELETE" });
      router.push(redirectAfterDelete);
      router.refresh();
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={editHref}>
        <Button variant="outline" type="button">
          Edit
        </Button>
      </Link>
      {confirming ? (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-navy/60">Delete this listing?</span>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Yes, delete
          </Button>
          <Button variant="ghost" onClick={() => setConfirming(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button variant="ghost" className="text-brand-red" onClick={() => setConfirming(true)}>
          Delete
        </Button>
      )}
    </div>
  );
}
