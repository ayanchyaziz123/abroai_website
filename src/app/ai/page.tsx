"use client";

import { useEffect, useRef, useState, Suspense, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RequireAuth from "@/components/RequireAuth";
import { api, ApiError } from "@/lib/api";

const GREETING_TEXT =
  "I'm here to help with your immigration journey — visa questions, job search, housing, healthcare, and more.";

type AiListing = { id: string; type: string; title: string; location?: string; image_url?: string | null; sub?: string | null };

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  listings?: AiListing[];
  suggestions?: string[];
  greeting?: boolean;
};

function greetingMessage(): ChatMessage {
  return { id: "greeting", role: "assistant", content: GREETING_TEXT, greeting: true };
}

// Listings live in different Django apps by type — this mirrors the same
// routing every other part of the site uses (listing?type=&id= vs
// professional?type=&id=), just picked per-item since one AI reply can
// mix listing types and professionals together.
function hrefFor(item: AiListing) {
  if (item.type === "attorney" || item.type === "doctor") return `/professional?type=${item.type}&id=${item.id}`;
  return `/listing?type=${item.type}&id=${item.id}`;
}

function AiChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [messages, setMessages] = useState<ChatMessage[]>([greetingMessage()]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoSent = useRef(false);
  const loadedHistory = useRef(false);

  useEffect(() => {
    if (loadedHistory.current) return;
    loadedHistory.current = true;
    api("/ai/conversation/")
      .then((data) => {
        const msgs = (data as { messages: ChatMessage[] }).messages;
        if (msgs?.length) setMessages(msgs);
      })
      .catch(() => {
        // Best-effort — a failed history load just leaves the fresh greeting.
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery && !autoSent.current) {
      autoSent.current = true;
      send(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError("");
    const userMsg: ChatMessage = { id: `local-${Date.now()}`, role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const history = nextMessages.filter((m) => !m.greeting).map((m) => ({ role: m.role, content: m.content }));

    try {
      const data = (await api("/ai/chat/", { method: "POST", body: { messages: history } })) as {
        reply: string;
        listings: AiListing[];
        suggestions: string[];
        message_id: number;
      };
      setMessages((prev) => [
        ...prev,
        {
          id: String(data.message_id ?? Date.now() + 1),
          role: "assistant",
          content: data.reply,
          listings: data.listings || [],
          suggestions: data.suggestions || [],
        },
      ]);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: "assistant", content: `Sorry, I ran into an issue: ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  async function onNewChat() {
    if (loading) return;
    try {
      await api("/ai/new/", { method: "POST" });
    } catch {
      // best-effort
    }
    setMessages([greetingMessage()]);
    router.replace("/ai");
  }

  const visible = messages.filter((m) => !m.greeting || messages.length === 1);

  return (
    <div className="flex min-h-full flex-col bg-ground">
      <Nav />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[15px]">✨</span>
            <h1 className="font-display text-xl font-semibold text-ink">Abrofy AI Assistant</h1>
          </div>
          <button onClick={onNewChat} className="text-[12.5px] font-medium text-accent hover:underline">
            New chat
          </button>
        </div>

        <div className="mt-6 flex flex-1 flex-col gap-4">
          {visible.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                  m.role === "user" ? "bg-accent text-white" : "border border-line bg-surface text-ink"
                }`}
              >
                {m.content}
              </div>

              {!!m.listings?.length && (
                <div className="mt-2 flex max-w-full gap-2.5 overflow-x-auto pb-1">
                  {m.listings.map((item) => (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={hrefFor(item)}
                      className="flex w-40 shrink-0 flex-col overflow-hidden rounded-xl border border-line bg-surface transition hover:shadow-md"
                    >
                      <div className="aspect-[4/3] w-full bg-surface-2">
                        {item.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="p-2.5">
                        <p className="line-clamp-1 text-[12.5px] font-semibold text-ink">{item.title}</p>
                        {(item.sub || item.location) && (
                          <p className="line-clamp-1 text-[11px] text-ink-dim">{item.sub || item.location}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!!m.suggestions?.length && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      disabled={loading}
                      className="rounded-full bg-surface-2 px-3 py-1.5 text-[12px] font-medium text-ink-dim transition hover:bg-accent-dim hover:text-accent disabled:opacity-60"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start">
              <div className="rounded-2xl border border-line bg-surface px-4 py-2.5 text-[14px] text-ink-faint">
                Thinking…
              </div>
            </div>
          )}

          {error && <p className="text-[13px] text-red-600">{error}</p>}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={onSubmit} className="sticky bottom-6 mt-6 flex items-center gap-2 rounded-full border border-line bg-surface p-1.5 pl-4 shadow-sm">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about visas, jobs, housing, or anything…"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-faint"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default function AiPage() {
  return (
    <Suspense fallback={null}>
      <RequireAuth>
        <AiChatContent />
      </RequireAuth>
    </Suspense>
  );
}
