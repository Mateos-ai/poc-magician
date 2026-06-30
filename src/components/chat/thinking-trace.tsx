import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BarChart3,
  Building2,
  CalendarClock,
  Check,
  Globe,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";

import {
  ApolloLogo,
  GmailLogo,
  GoogleCalendarLogo,
  HubSpotLogo,
} from "@/components/brand/integration-logos";
import type { CardKind } from "@/components/chat/response-cards";
import { cn } from "@/lib/utils";

type TraceStep = {
  label: string;
  node: ReactNode;
  ms: number;
  integration?: boolean;
};

export const TRACE_STEPS: Record<CardKind, TraceStep[]> = {
  day: [
    {
      label: "Connecting to your Google Calendar",
      node: <GoogleCalendarLogo className="h-4 w-4" />,
      ms: 750,
      integration: true,
    },
    { label: "Reading today's schedule", node: <CalendarClock className="h-4 w-4 text-indigo-500" />, ms: 550 },
    {
      label: "Scanning Gmail for replies you owe",
      node: <GmailLogo className="h-4 w-4" />,
      ms: 700,
      integration: true,
    },
    {
      label: "Reading participants & deals in HubSpot",
      node: <HubSpotLogo className="h-4 w-4" />,
      ms: 1400,
      integration: true,
    },
    { label: "Drafting your priorities", node: <Sparkles className="h-4 w-4 text-amber-600" />, ms: 1600 },
  ],
  leads: [
    { label: "Reading your ideal-customer profile", node: <Target className="h-4 w-4 text-amber-600" />, ms: 600 },
    {
      label: "Searching Apollo for matching companies",
      node: <ApolloLogo className="h-4 w-4" />,
      ms: 1100,
      integration: true,
    },
    { label: "Scanning the web for buying signals", node: <Globe className="h-4 w-4 text-teal-600" />, ms: 900 },
    {
      label: "Enriching contacts & finding verified emails",
      node: <ApolloLogo className="h-4 w-4" />,
      ms: 1200,
      integration: true,
    },
    { label: "Scoring leads against your best customers", node: <Sparkles className="h-4 w-4 text-amber-600" />, ms: 1400 },
  ],
  opportunities: [
    {
      label: "Connecting to your HubSpot",
      node: <HubSpotLogo className="h-4 w-4" />,
      ms: 900,
      integration: true,
    },
    { label: "Reading your existing accounts", node: <Building2 className="h-4 w-4 text-indigo-500" />, ms: 1300 },
    { label: "Checking usage, headcount & renewals", node: <TrendingUp className="h-4 w-4 text-teal-600" />, ms: 1000 },
    { label: "Surfacing expansion plays", node: <Sparkles className="h-4 w-4 text-amber-600" />, ms: 1500 },
  ],
  strategy: [
    {
      label: "Connecting to your HubSpot",
      node: <HubSpotLogo className="h-4 w-4" />,
      ms: 900,
      integration: true,
    },
    { label: "Analyzing 90 days of pipeline", node: <BarChart3 className="h-4 w-4 text-indigo-500" />, ms: 1400 },
    { label: "Comparing won vs. lost deals", node: <Trophy className="h-4 w-4 text-amber-600" />, ms: 950 },
    { label: "Pulling together where to focus", node: <Sparkles className="h-4 w-4 text-amber-600" />, ms: 1500 },
  ],
};

export function ThinkingTrace({
  kind,
  done,
  onDone,
}: {
  kind: CardKind;
  done?: boolean;
  onDone: () => void;
}) {
  const steps = TRACE_STEPS[kind];
  const [completed, setCompleted] = useState(done ? steps.length : 0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  // State-driven scheduler: re-runs on each tick, so it survives React's
  // StrictMode double-mount (the previous timer-once approach got cleared and
  // left the first step spinning forever).
  useEffect(() => {
    if (done) return;
    if (completed >= steps.length) {
      const t = window.setTimeout(() => doneRef.current(), 350);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(
      () => setCompleted((c) => c + 1),
      steps[completed]?.ms ?? 700
    );
    return () => window.clearTimeout(t);
  }, [completed, steps.length, done]);

  const allDone = completed >= steps.length;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card px-3.5 shadow-sm transition-all",
        allDone ? "py-2" : "py-3"
      )}
    >
      <ul className={cn("transition-all", allDone ? "space-y-1.5" : "space-y-2.5")}>
        {steps.map((s, idx) => {
          const stepDone = idx < completed;
          const active = idx === completed;
          return (
            <li
              key={idx}
              className={cn(
                "flex items-center gap-3 transition-opacity",
                !stepDone && !active && "opacity-40"
              )}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-card shadow-xs">
                {s.node}
              </span>
              <span
                className={cn(
                  "flex-1 text-sm transition-colors",
                  active
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
              {stepDone ? (
                <Check className="h-4 w-4 shrink-0 text-teal-600" />
              ) : active ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-amber-600" />
              ) : (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/30" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Collapsed "what I used" line shown above the finished card. */
export function TraceSummary({ kind }: { kind: CardKind }) {
  const integrations = TRACE_STEPS[kind].filter((s) => s.integration);
  if (integrations.length === 0) return null;
  return (
    <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
      <Check className="h-3.5 w-3.5 text-teal-600" />
      <span>Checked</span>
      <div className="flex items-center gap-1">
        {integrations.map((s, i) => (
          <span
            key={i}
            className="flex h-5 w-5 items-center justify-center rounded border bg-card"
          >
            {s.node}
          </span>
        ))}
      </div>
    </div>
  );
}
