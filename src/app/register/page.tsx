"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Field, inputClass } from "@/components/ui/Field";
import Button from "@/components/ui/Button";

const COUNTRIES = [
  { name: "Bangladesh", flag: "🇧🇩" },
  { name: "India", flag: "🇮🇳" },
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Philippines", flag: "🇵🇭" },
  { name: "China", flag: "🇨🇳" },
  { name: "Other", flag: "🌍" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [homeCountry, setHomeCountry] = useState(COUNTRIES[0].name);
  const [livesIn, setLivesIn] = useState("Queens, NY");

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data?.detail || "Could not send code.");
      setStep(2);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data?.detail || "Invalid code.");
      setStep(3);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const country = COUNTRIES.find((c) => c.name === homeCountry) || COUNTRIES[0];
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          handle,
          home_country: country.name,
          country_flag: country.flag,
          lives_in: livesIn,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data?.detail || "Could not create your account.");
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-extrabold text-navy">Create your account</h1>
      <p className="mt-1 text-sm text-navy/55">
        Step {step} of 3 —{" "}
        {step === 1 ? "verify your email" : step === 2 ? "enter the code" : "your details"}
      </p>

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 card-shadow">
        {error && (
          <div className="mb-4 rounded-lg bg-brand-red/10 px-3 py-2 text-sm font-medium text-brand-red">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-4">
            <Field label="Email address">
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </Field>
            <Button type="submit" className="w-full" loading={loading}>
              Send verification code
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <p className="text-sm text-navy/60">
              We sent a 6-digit code to <span className="font-semibold text-navy">{email}</span>.
            </p>
            <Field label="Verification code">
              <input
                className={`${inputClass} text-center text-lg tracking-[0.5em]`}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                maxLength={6}
                required
              />
            </Field>
            <Button type="submit" className="w-full" loading={loading}>
              Verify
            </Button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs font-medium text-navy/50 hover:text-navy"
            >
              Use a different email
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={submitRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name">
                <input className={inputClass} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </Field>
              <Field label="Last name">
                <input className={inputClass} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </Field>
            </div>
            <Field label="Handle" hint="Letters, numbers, underscores — 3 to 30 characters.">
              <input
                className={inputClass}
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g. jamal_nyc"
                required
              />
            </Field>
            <Field label="Password" hint="At least 8 characters.">
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Home country">
                <select className={inputClass} value={homeCountry} onChange={(e) => setHomeCountry(e.target.value)}>
                  {COUNTRIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Currently living in">
                <input className={inputClass} value={livesIn} onChange={(e) => setLivesIn(e.target.value)} />
              </Field>
            </div>
            <Button type="submit" className="w-full" loading={loading}>
              Create account
            </Button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-navy/60">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-blue hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
