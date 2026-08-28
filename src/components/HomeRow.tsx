"use client";

import { useEffect, useRef, useState, ReactNode, WheelEvent, PointerEvent } from "react";
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
  const drag = useRef<{ startX: number; startScrollLeft: number; dragging: boolean }>({
    startX: 0,
    startScrollLeft: 0,
    dragging: false,
  });

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
  // default (only a trackpad's horizontal gesture or dragging the
  // scrollbar does) — redirecting vertical wheel delta here is what makes
  // "just scroll over the cards" actually move them on a normal mouse.
  function onWheel(e: WheelEvent<HTMLDivElement>) {
    if (!scrollerRef.current) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // already horizontal (trackpad) — let it through
    scrollerRef.current.scrollLeft += e.deltaY;
    e.preventDefault();
  }

  // Click-and-drag scrolling for mouse users — touch already scrolls
  // natively, this just gives a mouse the same "grab and slide" behavior.
  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch" || !scrollerRef.current) return;
    drag.current = { startX: e.clientX, startScrollLeft: scrollerRef.current.scrollLeft, dragging: true };
    scrollerRef.current.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current.dragging || !scrollerRef.current) return;
    scrollerRef.current.scrollLeft = drag.current.startScrollLeft - (e.clientX - drag.current.startX);
  }
  function onPointerUp() {
    drag.current.dragging = false;
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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="mt-3 flex cursor-grab gap-3.5 overflow-x-auto pb-2 active:cursor-grabbing"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
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
