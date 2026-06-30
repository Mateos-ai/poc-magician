import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  Clock,
  Compass,
  Lightbulb,
  type LucideIcon,
  Mail,
  Pencil,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type CardKind = "day" | "leads" | "opportunities" | "strategy";

/** Short canned intro Mateos "says" above each card. */
export const CARD_INTRO: Record<CardKind, (firstName: string) => string> = {
  day: (n) =>
    `Here's your day, ${n}. A few things need you first — I've drafted what I can.`,
  leads: () =>
    `Found 12 companies that look like your best customers. Here are the four strongest:`,
  opportunities: () =>
    `Three accounts you already own are showing expansion signals:`,
  strategy: () =>
    `Here's where I'd spend your time this quarter, based on what's actually closing:`,
};

const toneMap: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700",
  teal: "bg-teal-100 text-teal-700",
  indigo: "bg-indigo-100 text-indigo-600",
  rose: "bg-[#FCE9EA] text-[#b3262b]",
};

function ActionPill({
  icon: Icon,
  label,
  primary,
}: {
  icon: LucideIcon;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-7 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-semibold transition-colors",
        primary
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border text-muted-foreground hover:bg-muted"
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

function Row({
  icon: Icon,
  tone,
  title,
  meta,
  children,
}: {
  icon: LucideIcon;
  tone: keyof typeof toneMap | string;
  title: ReactNode;
  meta: string;
  children?: ReactNode;
}) {
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          toneMap[tone]
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{meta}</p>
      </div>
      {children}
    </li>
  );
}

function CardShell({
  icon: Icon,
  title,
  subtitle,
  children,
  footer,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center gap-2.5 border-b bg-gradient-soft px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card shadow-xs">
          <Icon className="h-4 w-4 text-amber-700" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-bold leading-tight">{title}</p>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
      {footer && <div className="border-t px-4 py-2.5">{footer}</div>}
    </div>
  );
}

/* ── Prepare my day ────────────────────────────────────────── */
function DayCard() {
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const chips = [
    "3 priorities",
    "2 drafts ready",
    "1 flagged",
    "4 surfaced",
  ];

  return (
    <CardShell icon={CalendarClock} title="Your day" subtitle={dateStr}>
      <div className="flex flex-wrap gap-1.5 px-4 pt-3">
        {chips.map((c) => (
          <span
            key={c}
            className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground"
          >
            {c}
          </span>
        ))}
      </div>
      <ul className="mt-1 divide-y">
        <Row
          icon={CalendarClock}
          tone="indigo"
          title="Intro call · Meridian Talent"
          meta="Priority · 1:30 PM · 30 min"
        >
          <ActionPill icon={Sparkles} label="Prep brief" />
        </Row>
        <Row
          icon={Mail}
          tone="amber"
          title="Reply to Dana · Harlow & Co."
          meta="Draft ready · “Can you send the proposal?”"
        >
          <ActionPill icon={Pencil} label="Review" />
        </Row>
        <Row
          icon={AlertTriangle}
          tone="rose"
          title="Northwind deal has gone quiet"
          meta="Flagged · no reply in 6 days"
        >
          <ActionPill icon={Send} label="Draft nudge" primary />
        </Row>
        <Row
          icon={Target}
          tone="teal"
          title="4 new leads matched overnight"
          meta="Surfaced · like your best customers"
        >
          <ActionPill icon={ArrowRight} label="Review" />
        </Row>
      </ul>
    </CardShell>
  );
}

/* ── Get me new leads ──────────────────────────────────────── */
const LEADS = [
  { company: "Meridian Talent", role: "VP People", score: 94, why: "Closed-won lookalike · hiring surge" },
  { company: "Harlow & Co.", role: "Head of Talent", score: 89, why: "Matches ICP industry + size" },
  { company: "Northwind Group", role: "COO", score: 81, why: "Recent funding · expanding team" },
  { company: "Atlas Partners", role: "Managing Director", score: 78, why: "Hiring 3 senior roles this quarter" },
];

function LeadsCard() {
  return (
    <CardShell
      icon={Target}
      title="12 new leads · like your best customers"
      subtitle="Enriched & scored against your ICP"
      footer={
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline"
        >
          View all 12 leads <ArrowRight className="h-3.5 w-3.5" />
        </button>
      }
    >
      <ul className="divide-y">
        {LEADS.map((l) => (
          <li key={l.company} className="flex items-center gap-3 px-4 py-3">
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
              <p className="truncate text-xs text-muted-foreground">{l.why}</p>
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
            <ActionPill icon={Pencil} label="Draft" />
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

/* ── Discover new opportunities ────────────────────────────── */
const OPPS = [
  { account: "Cobalt Systems", signal: "Added 40 staff in 60 days", play: "Pitch the team plan", tone: "teal" },
  { account: "Vertex Inc.", signal: "Renewal in 45 days", play: "Open renewal early", tone: "amber" },
  { account: "Lumen Co.", signal: "Using 90% of seats", play: "Suggest a seat expansion", tone: "indigo" },
];

function OpportunitiesCard() {
  return (
    <CardShell
      icon={TrendingUp}
      title="3 expansion opportunities"
      subtitle="In accounts you already own"
    >
      <ul className="divide-y">
        {OPPS.map((o) => (
          <Row
            key={o.account}
            icon={TrendingUp}
            tone={o.tone}
            title={o.account}
            meta={`${o.signal} · ${o.play}`}
          >
            <ActionPill icon={Pencil} label="Draft" />
          </Row>
        ))}
      </ul>
    </CardShell>
  );
}

/* ── Dive into strategy ────────────────────────────────────── */
const METRICS = [
  { icon: Trophy, label: "Win rate", value: "28%", delta: "+5 pts" },
  { icon: Target, label: "Best segment", value: "Recruiting", delta: "50–200 staff" },
  { icon: Clock, label: "Avg. deal cycle", value: "34 days", delta: "−6 days" },
];

const MOVES = [
  "Double down on recruiting firms — they close 2× faster than your average.",
  "Re-engage 7 deals stalled past 30 days; I've drafted nudges for each.",
  "Shift outreach earlier in the week — your reply rate is highest on Tuesdays.",
];

function StrategyCard() {
  return (
    <CardShell
      icon={Compass}
      title="Where to focus this quarter"
      subtitle="Based on your last 90 days of pipeline"
    >
      <div className="grid grid-cols-3 gap-px bg-border">
        {METRICS.map((m) => (
          <div key={m.label} className="bg-card px-3 py-3">
            <m.icon className="h-4 w-4 text-muted-foreground" />
            <p className="mt-2 font-display text-lg font-extrabold leading-none tracking-tight">
              {m.value}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">{m.label}</p>
            <p className="text-[11px] font-semibold text-teal-700">{m.delta}</p>
          </div>
        ))}
      </div>
      <ul className="space-y-2.5 px-4 py-3.5">
        {MOVES.map((move) => (
          <li key={move} className="flex gap-2.5">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span className="text-sm leading-snug">{move}</span>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

export function ResponseCard({ kind }: { kind: CardKind }) {
  switch (kind) {
    case "day":
      return <DayCard />;
    case "leads":
      return <LeadsCard />;
    case "opportunities":
      return <OpportunitiesCard />;
    case "strategy":
      return <StrategyCard />;
  }
}
