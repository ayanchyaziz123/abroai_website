"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { api, setTokens, ApiError } from "@/lib/api";

type Step = "form" | "otp" | "details";
type Country = { flag: string; name: string; code: string };

// Same derivation as the mobile app's AllDoneScreen — the handle is never
// typed by the user, it's the email's local part sanitized down to
// letters/numbers/underscores, so signup never asks for one extra field
// the way the old web-only form did.
function deriveHandle(email: string, firstName: string) {
  const raw = (email.split("@")[0] || firstName.toLowerCase())
    .replace(/[^a-z0-9_]/gi, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase();
  return raw || "user";
}

export default function SignupPage() {
  const { refreshUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("form");

  // Step 1 — matches mobile SignUpScreen
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState("");

  // Step 2 — OTP
  const [code, setCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resending, setResending] = useState(false);

  // Step 3 — matches mobile FromCountryScreen + AllDoneScreen
  const [countries, setCountries] = useState<Country[]>([]);
  const [homeCountry, setHomeCountry] = useState("");
  const [city, setCity] = useState("");
  const [detailsError, setDetailsError] = useState("");

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (step !== "details") return;
    api("/catalog/countries/", { auth: false })
      .then((data) => {
        const list = data as Country[];
        setCountries(list);
        if (list.length) setHomeCountry((prev) => prev || list[0].name);
      })
      .catch(() => {});
  }, [step]);

  async function onSubmitForm(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setFormError("");
    if (!firstName.trim() || !lastName.trim()) return setFormError("First and last name are required.");
    if (!email.includes("@")) return setFormError("Enter a valid email address.");
    if (password.length < 8) return setFormError("Password must be at least 8 characters.");
    if (confirm !== password) return setFormError("Passwords do not match.");

    setBusy(true);
    try {
      await api("/auth/otp/send/", { method: "POST", body: { email: email.trim().toLowerCase() }, auth: false });
      setStep("otp");
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onVerifyOtp(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setOtpError("");
    setBusy(true);
    try {
      await api("/auth/otp/verify/", {
        method: "POST",
        body: { email: email.trim().toLowerCase(), code },
        auth: false,
      });
      setStep("details");
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : "Invalid or expired code.");
    } finally {
      setBusy(false);
    }
  }

  async function onResend() {
    if (resending) return;
    setResending(true);
    try {
      await api("/auth/otp/send/", { method: "POST", body: { email: email.trim().toLowerCase() }, auth: false });
      setCode("");
      setOtpError("");
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : "Could not resend code.");
    } finally {
      setResending(false);
    }
  }

  async function onFinish(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setDetailsError("");
    if (!homeCountry) return setDetailsError("Select your home country.");
    if (!city.trim()) return setDetailsError("Enter your city.");

    setBusy(true);
    try {
      const data = (await api("/auth/register/", {
        method: "POST",
        auth: false,
        body: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          password,
          handle: deriveHandle(email, firstName),
          home_country: homeCountry,
          lives_in: city.trim(),
        },
      })) as { access: string; refresh: string };
      setTokens(data.access, data.refresh);
      await refreshUser();
      router.push("/browse");
    } catch (err) {
      setDetailsError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
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
          {step === "form" && "Same account as the Abrofy app."}
          {step === "otp" && `Enter the code we sent to ${email}.`}
          {step === "details" && "Where are you from, and where do you live now?"}
        </p>

        {step === "form" && (
          <form onSubmit={onSubmitForm} className="mt-8 flex flex-col gap-4">
            <div className="flex gap-3">
              <label className="flex flex-1 flex-col gap-1.5">
                <span className="text-[12.5px] font-medium text-ink-dim">First name</span>
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
                />
              </label>
              <label className="flex flex-1 flex-col gap-1.5">
                <span className="text-[12.5px] font-medium text-ink-dim">Last name</span>
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
                />
              </label>
            </div>

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

            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-dim">Confirm password</span>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
              />
            </label>

            {formError && <p className="text-[13px] text-red-600">{formError}</p>}

            <button
              type="submit"
              disabled={busy}
              className="mt-2 rounded-full bg-accent px-5 py-3 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Sending code…" : "Continue"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={onVerifyOtp} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-dim">Verification code</span>
              <input
                type="text"
                required
                inputMode="numeric"
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-[16px] tracking-[0.3em] text-ink outline-none focus:border-accent"
                placeholder="000000"
                maxLength={6}
              />
            </label>
            {otpError && <p className="text-[13px] text-red-600">{otpError}</p>}
            <button
              type="submit"
              disabled={busy}
              className="mt-2 rounded-full bg-accent px-5 py-3 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Verifying…" : "Verify"}
            </button>
            <button
              type="button"
              onClick={onResend}
              disabled={resending}
              className="text-[13px] font-medium text-accent hover:underline disabled:opacity-60"
            >
              {resending ? "Resending…" : "Resend code"}
            </button>
          </form>
        )}

        {step === "details" && (
          <form onSubmit={onFinish} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-dim">Home country</span>
              <select
                required
                value={homeCountry}
                onChange={(e) => setHomeCountry(e.target.value)}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
              >
                {countries.length === 0 && <option value="">Loading…</option>}
                {countries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-dim">Current city</span>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Queens, NY"
                className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none focus:border-accent"
              />
            </label>

            {detailsError && <p className="text-[13px] text-red-600">{detailsError}</p>}

            <button
              type="submit"
              disabled={busy}
              className="mt-2 rounded-full bg-accent px-5 py-3 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Creating account…" : "Finish signing up"}
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
