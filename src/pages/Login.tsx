import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Target, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { GoogleIcon } from "@/components/brand/google-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";

const pillars = [
  {
    icon: Sparkles,
    title: "One agent spine",
    body: "ChatGPT with your context and abilities — it reads your inbox, calendar and CRM and proposes the next move.",
  },
  {
    icon: Target,
    title: "Lead-Gen superpower",
    body: "Find companies like your best customers, enriched, scored and drafted — ready for review.",
  },
  {
    icon: ShieldCheck,
    title: "You press send",
    body: "Drafts everything, writes only to your own surfaces. Nothing leaves without a human in the loop.",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");

  // Demo only — no real auth. Sign-up walks into onboarding; sign-in goes
  // straight to the app.
  const destination = mode === "signup" ? "/onboarding" : "/chat";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(destination);
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* ── Left: brand panel ───────────────────────────────── */}
      <section className="relative hidden overflow-hidden bg-gradient-brand lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        {/* soft texture wash */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_30rem_at_15%_-10%,rgba(255,255,255,0.35),transparent_60%),radial-gradient(36rem_28rem_at_110%_110%,rgba(20,20,30,0.22),transparent_55%)]" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md">
            <Logo className="h-8 w-8" />
          </span>
          <span className="font-display text-2xl font-extrabold tracking-tight text-white">
            Mateos
          </span>
        </div>

        <div className="relative max-w-md text-white">
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight xl:text-5xl">
            Last-mile AI for the way SMBs actually sell.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/85">
            Meet the Sales Magician — one agent that lives inside your inbox,
            calendar and CRM, tops up your funnel and drafts the follow-ups, so
            small teams sell like big ones.
          </p>

          <ul className="mt-10 space-y-5">
            {pillars.map((p) => (
              <li key={p.title} className="flex gap-3.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
                  <p.icon className="h-4 w-4 text-white" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold">{p.title}</p>
                  <p className="text-sm leading-snug text-white/80">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">
          V0 Alpha · for B2B SMBs with relationship-driven sales
        </p>
      </section>

      {/* ── Right: auth form ────────────────────────────────── */}
      <section className="relative flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(46rem_32rem_at_90%_-10%,#FFF7F2,transparent_60%),radial-gradient(40rem_30rem_at_-10%_110%,#F4F3FD,transparent_55%)] lg:hidden" />

        <div className="w-full max-w-sm">
          {/* compact logo for small screens */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Logo className="h-9 w-9" />
            <span className="font-display text-xl font-extrabold tracking-tight">
              Mateos
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to pick up where the Magician left off."
              : "Start your 14-day design-partner trial — no card required."}
          </p>

          {/* mode toggle */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted p-1">
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-md py-1.5 text-sm font-semibold transition-colors",
                  mode === m
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(destination)}
            className="mt-6 w-full"
          >
            <GoogleIcon className="h-4 w-4" />
            Continue with Google
          </Button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              or
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" placeholder="Alex Carmel" required />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === "signin" && (
                  <button
                    type="button"
                    className="text-xs font-semibold text-amber-700 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="mt-1 w-full">
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            By continuing you agree to the{" "}
            <a className="font-medium text-foreground hover:underline" href="#">
              Terms
            </a>{" "}
            and{" "}
            <a className="font-medium text-foreground hover:underline" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
