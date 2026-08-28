"use client";

import { useEffect, useRef, useState, ReactNode, WheelEvent } from "react";
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
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    api(endpoint, { auth: false })
      .then((data) => {
        if (cancelled) return;
        const results = (data as { results?: T[] })?.results ?? (data as T[]);
        setItems(Array.isArray(results) ? results.slice(0, 8) : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  // A plain vertical mouse wheel does nothing on an overflow-x row by
  // default (only a trackpad's horizontal gesture, a touch swipe, or
  // dragging the scrollbar does) — redirecting vertical wheel delta here
  // is what makes "just scroll over the cards" move them on a normal
  // mouse. Touch keeps its native scroll untouched (this never fires for
  // a touch-originated gesture).
  function onWheel(e: WheelEvent<HTMLDivElement>) {
    if (!scrollerRef.current) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // already horizontal (trackpad) — let it through natively
    scrollerRef.current.scrollLeft += e.deltaY;
    e.preventDefault();
  }

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
      <div
        ref={scrollerRef}
        onWheel={onWheel}
        className="mt-3 flex gap-3.5 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
      >
        {items === null
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] w-44 shrink-0 animate-pulse rounded-2xl bg-surface-2" />
            ))
          : items.map((item) => <div key={item.id}>{renderItem(item)}</div>)}
      </div>
    </div>
  );
}
