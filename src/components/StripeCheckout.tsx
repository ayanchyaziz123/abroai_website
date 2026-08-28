"use client";

import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/config";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function PayForm({ onSuccess, busyLabel }: { onSuccess: (paymentIntentId: string) => void; busyLabel: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  async function onPay() {
    if (!stripe || !elements || paying) return;
    setPaying(true);
    setError("");
    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (confirmError) {
      setError(confirmError.message || "Payment failed. Please try again.");
      setPaying(false);
      return;
    }
    if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      setError("Payment did not complete. Please try again.");
      setPaying(false);
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <PaymentElement />
      {error && <p className="text-[13px] text-red-600">{error}</p>}
      <button
        type="button"
        onClick={onPay}
        disabled={paying}
        className="rounded-full bg-ink px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-accent disabled:opacity-60"
      >
        {paying ? busyLabel : "Pay & continue"}
      </button>
    </div>
  );
}

export default function StripeCheckout({
  clientSecret,
  onSuccess,
  busyLabel = "Processing…",
}: {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  busyLabel?: string;
}) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PayForm onSuccess={onSuccess} busyLabel={busyLabel} />
    </Elements>
  );
}
