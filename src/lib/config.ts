// Same production API the mobile app talks to — no separate web backend.
export const API_BASE = "https://abroai-backend-production.up.railway.app/api";

// Public test key, same one the mobile app ships (Abrofy/app.json) — safe to
// expose client-side, that's what a Stripe publishable key is for.
export const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51TtbMoRtx9tL0FIy7BV1SUSD5LRD3f9Hq6hTIJinVKB7oHYCar9wl4gRuC4PddeUPkN0t8CCWSMEImcWX8x0dRqw00F3RJ8GPq";
