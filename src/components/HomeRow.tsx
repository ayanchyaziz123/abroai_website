"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function HomeRow<T extends { id: string | number }>({
  title,
  emoji,
  endpoint,
  viewAllHref,
  renderItem,
}: {
  title: string;
  emoji: string;
  endpoint: string;
  viewAllHref: string;
  renderItem: (item: T) => ReactNode;
}) {
  const [items, setItems] = useState<T[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    api(endpoint, { auth: false })
      .then((data) => {
        if (cancelled) return;
        const results = (data as { results?: T[] })?.results ?? (data as T[]);
        setItems(Array.isArray(results) ? results.slice(0, 6) : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  if (items !== null && items.length === 0) return null;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <span>{emoji}</span> {title}
        </h3>
        <Link href={viewAllHref} className="text-[12.5px] font-medium text-accent hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-3 flex flex-wrap gap-3.5">
        {items === null
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] w-44 shrink-0 animate-pulse rounded-2xl bg-surface-2" />
            ))
          : items.map((item) => <div key={item.id}>{renderItem(item)}</div>)}
      </div>
    </div>
  );
}
