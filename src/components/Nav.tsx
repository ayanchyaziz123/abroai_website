import Image from "next/image";

export default function Nav() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-7">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 overflow-hidden rounded-xl">
          <Image src="/app-icon.png" alt="" width={32} height={32} />
        </div>
        <span className="font-display text-lg font-semibold text-ink">Abrofy</span>
      </div>
      <a
        href="/#download"
        className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-accent"
      >
        Get the app
      </a>
    </header>
  );
}
