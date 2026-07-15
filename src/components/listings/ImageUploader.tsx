"use client";

import { useRef, useMemo, useEffect } from "react";

const MAX_IMAGES = 5;

export type ExistingImage = { id: number; url: string };

export default function ImageUploader({
  files,
  onFilesChange,
  existing = [],
  onRemoveExisting,
  accent,
}: {
  files: File[];
  onFilesChange: (files: File[]) => void;
  existing?: ExistingImage[];
  onRemoveExisting?: (id: number) => void;
  accent: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Derived directly during render (not effect+setState) so previews are
  // never a render behind `files`; the effect below only handles cleanup.
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  const totalCount = existing.length + files.length;
  const remaining = Math.max(0, MAX_IMAGES - totalCount);

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    onFilesChange([...files, ...picked].slice(0, MAX_IMAGES - existing.length));
    e.target.value = "";
  }

  function removeNew(idx: number) {
    onFilesChange(files.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {existing.map((img) => (
          <div key={img.id} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            {onRemoveExisting && (
              <button
                type="button"
                onClick={() => onRemoveExisting(img.id)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition group-hover:opacity-100"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {previews.map((src, idx) => (
          <div key={src} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeNew(idx)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-black/15 text-navy/40 transition hover:border-black/25 hover:text-navy/60"
            style={{ borderColor: `${accent}55` }}
          >
            <span className="text-xl leading-none">+</span>
            <span className="text-[10px] font-semibold">Add photo</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlePick}
      />
      <p className="mt-2 text-xs text-navy/40">
        {totalCount}/{MAX_IMAGES} photos {totalCount === 0 && "· optional, but listings with photos get more responses"}
      </p>
    </div>
  );
}
