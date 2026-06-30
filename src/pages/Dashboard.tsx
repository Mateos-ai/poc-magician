import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Check,
  Inbox,
  Mail,
  Pencil,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "New leads this week", value: "32", delta: "+12", icon: Users },
  { label: "Drafts to review", value: "3", delta: "ready", icon: Inbox },
  { label: "Meetings today", value: "2", delta: "next 1:30", icon: CalendarClock },
  { label: "Replies received", value: "5", delta: "+2", icon: TrendingUp },
];

// "What do I have today?" — rides free on read-only Gmail/Calendar.
const TODAY = [
  {
    icon: CalendarClock,
    tone: "indigo",
    title: "Intro call · Meridian Talent",
    meta: "1:30 PM · 30 min · Google Meet",
  },
  {
    icon: Mail,
    tone: "amber",
    title: "Reply needed · Dana at Harlow & Co.",
    meta: "“Can you send over the proposal?” · 2 days ago",
  },
  {
    icon: Users,
    tone: "teal",
    title: "Follow-up due · 4 leads gone quiet",
    meta: "No reply in 5+ days — Mateos drafted nudges",
  },
];

// Lead-Gen hero — an async job streaming results.
const LEADS = [
  { company: "Meridian Talent", role: "VP People", score: 94, why: "Closed-won lookalike · hiring surge" },
  { company: "Harlow & Co.", role: "Head of Talent", score: 89, why: "Matches ICP industry + size" },
  { company: "Northwind Group", role: "COO", score: 81, why: "Recent funding · expanding team" },
];

// Owned-surfaces rail — drafts waiting for a human to press send.
const DRAFTS = [
  { to: "Dana Levin · Harlow & Co.", subject: "Re: Proposal for Q3 search", channel: "Gmail draft" },
  { to: "Meridian Talent board", subject: "Comment: next steps after intro", channel: "Monday comment" },
  { to: "Sam Okoro · Northwind", subject: "Intro — execs like your team", channel: "Gmail draft" },
];

const PROMPTS = [
  "What do I have today?",
  "Which open emails are urgent?",
  "Find more leads like Meridian Talent",
  "Draft a follow-up to the quiet leads",
];

const toneMap: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700",
  teal: "bg-teal-100 text-teal-700",
  indigo: "bg-indigo-100 text-indigo-600",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { name } = getProfile();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-7">
      {/* ── Greeting ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {greeting}, {name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's where things stand — nothing goes out without your say-so.
          </p>
        </div>
        <Button onClick={() => navigate("/chat")}>
          <Sparkles className="h-4 w-4" />
          Ask Mateos
        </Button>
      </div>

      {/* ── Stat cards ──────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <s.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-[11px] font-semibold text-teal-700">
                {s.delta}
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-extrabold tracking-tight">
              {s.value}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Two-column body ─────────────────────────────────── */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* left / wide */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          {/* Today */}
          <section className="rounded-lg border bg-card shadow-xs">
            <div className="flex items-center justify-between border-b px-5 py-3.5">
              <h2 className="font-display text-sm font-bold">Your day</h2>
              <span className="text-xs text-muted-foreground">
                From Gmail & Calendar · read-only
              </span>
            </div>
            <ul className="divide-y">
              {TODAY.map((t) => (
                <li
                  key={t.title}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/40"
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      toneMap[t.tone]
                    )}
                  >
                    <t.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{t.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.meta}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </section>

          {/* Lead-Gen run */}
          <section className="rounded-lg border bg-card shadow-xs">
            <div className="flex items-center justify-between border-b px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-700" />
                <h2 className="font-display text-sm font-bold">
                  Lead-Gen run · leads like your best customers
                </h2>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-800">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
                Running
              </span>
            </div>

            <div className="px-5 pt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Enriching & scoring</span>
                <span className="font-mono">32 / 50</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[64%] rounded-full bg-gradient-brand" />
              </div>
            </div>

            <ul className="mt-2 divide-y">
              {LEADS.map((l) => (
                <li key={l.company} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-xs font-bold text-white">
                    {l.company.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {l.company}
                      <span className="ml-1.5 font-normal text-muted-foreground">
                        · {l.role}
                      </span>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {l.why}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs font-bold",
                      l.score >= 90
                        ? "bg-teal-100 text-teal-800"
                        : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {l.score}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t px-5 py-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-amber-700"
                onClick={() => navigate("/top-funnel")}
              >
                View all 50 leads
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </section>
        </div>

        {/* right / narrow */}
        <div className="flex flex-col gap-5">
          {/* Review & send */}
          <section className="rounded-lg border bg-card shadow-xs">
            <div className="flex items-center justify-between border-b px-4 py-3.5">
              <div className="flex items-center gap-2">
                <Inbox className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-display text-sm font-bold">Review & send</h2>
              </div>
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                {DRAFTS.length}
              </span>
            </div>

            <ul className="divide-y">
              {DRAFTS.map((d) => (
                <li key={d.subject} className="px-4 py-3">
                  <p className="truncate text-sm font-semibold">{d.subject}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    To {d.to}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {d.channel}
                    </span>
                    <div className="ml-auto flex gap-1.5">
                      <button className="flex h-7 items-center gap-1 rounded-md border px-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted">
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                      <button className="flex h-7 items-center gap-1 rounded-md bg-primary px-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                        <Send className="h-3 w-3" />
                        Send
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-1.5 border-t px-4 py-2.5 text-[11px] text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-teal-600" />
              Drafted by Mateos — only you can press send.
            </p>
          </section>

          {/* Ask Mateos prompts */}
          <section className="rounded-lg border bg-card p-4 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border bg-card shadow-xs">
                <Logo className="h-4 w-4" />
              </span>
              <h2 className="font-display text-sm font-bold">Ask Mateos</h2>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => navigate("/chat")}
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-amber-50"
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <span className="flex-1">{p}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
