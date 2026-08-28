"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { api, setTokens, ApiError } from "@/lib/api";

type Step = "email" | "otp" | "details";

export default function SignupPage() {
  const { refreshUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendOtp(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      await api("/auth/otp/send/", { method: "POST", body: { email }, auth: false });
      setStep("otp");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      await api("/auth/otp/verify/", { method: "POST", body: { email, code }, auth: false });
      setStep("details");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid or expired code.");
    } finally {
      setBusy(false);
    }
  }

  async function register(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      const data = (await api("/auth/register/", {
        method: "POST",
        auth: false,
        body: {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          handle,
        },
      })) as { access: string; refresh: string };
      setTokens(data.access, data.refresh);
      await refreshUser();
      router.push("/browse");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-full bg-ground">
      <Nav />
      <main className="mx-auto max-w-sm px-6 py-16">
        <h1 className="font-display text-3xl font-semibold text-ink">Create an account</h1>
        <p className="mt-2 text-[14px] text-ink-dim">
          {step === "email" && "Start with your email — we'll send a code to verify it."}
          {step === "otp" && `Enter the code we sent to ${email}.`}
          {step === "details" && "Almost done — a few details about you."}
        </p>

        {step === "email" && (
          <form onSubmit={sendOtp} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-dim">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
                placeholder="you@example.com"
              />
            </label>
            {error && <p className="text-[13px] text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="mt-2 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-accent disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send verification code"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOtp} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-dim">Verification code</span>
              <input
                type="text"
                required
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] tracking-widest text-ink outline-none focus:border-accent"
                placeholder="123456"
              />
            </label>
            {error && <p className="text-[13px] text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="mt-2 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-accent disabled:opacity-60"
            >
              {busy ? "Verifying…" : "Verify"}
            </button>
          </form>
        )}

        {step === "details" && (
          <form onSubmit={register} className="mt-8 flex flex-col gap-4">
            <div className="flex gap-3">
              <label className="flex flex-1 flex-col gap-1.5">
                <span className="text-[12.5px] font-medium text-ink-dim">First name</span>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
                />
              </label>
              <label className="flex flex-1 flex-col gap-1.5">
                <span className="text-[12.5px] font-medium text-ink-dim">Last name</span>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-dim">Handle</span>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
                placeholder="yourname"
              />
              <span className="text-[11.5px] text-ink-faint">3–30 characters: letters, numbers, underscores.</span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-dim">Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
                placeholder="At least 8 characters"
              />
            </label>

            {error && <p className="text-[13px] text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="mt-2 rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-accent disabled:opacity-60"
            >
              {busy ? "Creating account…" : "Create account"}
            </button>
          </form>
        )}

        <p className="mt-6 text-[13px] text-ink-dim">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
