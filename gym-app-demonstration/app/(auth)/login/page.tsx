// filepath: c:\Users\Launchpad2\Downloads\gym-app-demonstration\gym-app-demonstration\app\(auth)\login\page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = useMemo(() => params.get("next") || "/dashboard", [params]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setError(data?.error ?? "Login failed");
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10">
      {/* match the app layout vibe */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_600px_at_20%_10%,rgba(59,130,246,.22),transparent_55%),radial-gradient(900px_500px_at_85%_0%,rgba(168,85,247,.16),transparent_55%)]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        {/* Left: marketing/hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Demo environment
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight">
            Run your gym like a modern product.
          </h1>
          <p className="muted max-w-xl">
            Track workouts, engagement, and retention—then turn it into actions.
            This build is UI-first with placeholders.
          </p>

          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Workout logging
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Retention analytics
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              AI insights
            </span>
          </div>
        </div>

        {/* Right: form */}
    <div className="card w-full max-w-md justify-self-end border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-5">
            <div className="text-sm font-semibold text-slate-200">Sign in</div>
            <p className="subtitle">
              Use demo creds configured in{" "}
              <span className="text-slate-200">.env.local</span>.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
      <label className="text-sm font-medium text-slate-200">Email:</label>
              <input
                className="input mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                placeholder="rob@launchpadphilly.org"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-200">Password:</label>
              <input
                className="input mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="password123"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-xs text-slate-500">
              Demo auth only (cookie). Replace with real auth for production.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}