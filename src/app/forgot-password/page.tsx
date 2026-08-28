"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { api, ApiError } from "@/lib/api";

type Step = "email" | "reset" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      await api("/auth/password/forgot/", {
        method: "POST",
        body: { email: email.trim().toLowerCase() },
        auth: false,
      });
      setStep("reset");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send code. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (resending) return;
    setResending(true);
    try {
      await api("/auth/password/forgot/", {
        method: "POST",
        body: { email: email.trim().toLowerCase() },
        auth: false,
      });
      setCode("");
    } catch {
      // best-effort — the visible resend button state is enough feedback
    } finally {
      setResending(false);
    }
  }

  async function resetPassword(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError("");
    if (code.length < 6) return setError("Enter the 6-digit code.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setBusy(true);
    try {
      await api("/auth/password/reset/", {
        method: "POST",
        body: { email: email.trim().toLowerCase(), code, password },
        auth: false,
      });
      setStep("done");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid or expired code.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-full bg-ground">
      <Nav />
      <main className="mx-auto max-w-sm px-6 py-16">
        {step !== "done" && (
          <>
            <h1 className="font-display text-3xl font-semibold text-ink">Reset your password</h1>
            <p className="mt-2 text-[14px] text-ink-dim">
              {step === "email"
                ? "We'll send a code to your email."
                : `Enter the code sent to ${email} and pick a new password.`}
            </p>
          </>
        )}

        {step === "email" && (
          <form onSubmit={sendCode} className="mt-8 flex flex-col gap-4">
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
              className="mt-2 rounded-full bg-accent px-5 py-3 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send code"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={resetPassword} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-dim">Verification code</span>
              <input
                type="text"
                required
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-[16px] tracking-[0.3em] text-ink outline-none focus:border-accent"
                placeholder="000000"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-dim">New password</span>
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
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-dim">Confirm new password</span>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
              />
            </label>
            {error && <p className="text-[13px] text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="mt-2 rounded-full bg-accent px-5 py-3 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Resetting…" : "Reset password"}
            </button>
            <button
              type="button"
              onClick={resend}
              disabled={resending}
              className="text-[13px] font-medium text-accent hover:underline disabled:opacity-60"
            >
              {resending ? "Resending…" : "Resend code"}
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="mt-8">
            <h1 className="font-display text-3xl font-semibold text-ink">Password reset</h1>
            <p className="mt-2 text-[14px] text-ink-dim">You can log in with your new password now.</p>
            <Link
              href="/login"
              className="mt-6 inline-block rounded-full bg-accent px-5 py-3 text-[14px] font-semibold text-white transition hover:opacity-90"
            >
              Log in
            </Link>
          </div>
        )}

        {step !== "done" && (
          <p className="mt-6 text-[13px] text-ink-dim">
            Remembered your password?{" "}
            <Link href="/login" className="font-medium text-accent hover:underline">
              Log in
            </Link>
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
