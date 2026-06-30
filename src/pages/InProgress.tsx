import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, type LucideIcon, Target } from "lucide-react";

import {
  ApolloLogo,
  HubSpotLogo,
} from "@/components/brand/integration-logos";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700",
  teal: "bg-teal-100 text-teal-700",
  indigo: "bg-indigo-100 text-indigo-600",
};

type Run = {
  id: string;
  logo?: ReactNode;
  icon?: LucideIcon;
  tone?: string;
  title: string;
  started: string;
  count: string;
  progress: number;
};

const RUNS: Run[] = [
  {
    id: "leadgen",
    icon: Target,
    tone: "amber",
    title: "Finding leads like Meridian Talent",
    started: "Started 8 min ago",
    count: "31 of 50 enriched & scored",
    progress: 62,
  },
  {
    id: "expansion",
    logo: <HubSpotLogo className="h-6 w-6" />,
    title: "Scanning your accounts for expansion signals",
    started: "Started 14 min ago",
    count: "23 of 40 accounts checked",
    progress: 58,
  },
  {
    id: "research",
    logo: <ApolloLogo className="h-6 w-6" />,
    title: "Researching attendees before the SaaStr meetup",
    started: "Started 20 min ago",
    count: "8 of 20 people enriched",
    progress: 40,
  },
  {
    id: "drafts",
    icon: Mail,
    tone: "indigo",
    title: "Drafting follow-ups for 4 quiet deals",
    started: "Started 2 min ago",
    count: "2 of 4 drafted",
    progress: 50,
  },
];

export default function InProgress() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-7">
      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          In progress
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What Mateos is working on right now. You'll get a nudge in Take Action
          when something's ready for you.
        </p>
      </header>

      <div className="mt-5 flex flex-col gap-2.5">
        {RUNS.map((run) => (
          <div
            key={run.id}
            className="flex items-center gap-3.5 rounded-lg border bg-card p-4 shadow-xs transition-shadow hover:shadow-sm"
          >
            {run.logo ? (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-card shadow-xs">
                {run.logo}
              </span>
            ) : (
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  toneMap[run.tone ?? "teal"]
                )}
              >
                {run.icon && <run.icon className="h-5 w-5" />}
              </span>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold">{run.title}</p>
                <span className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-800">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
                  In progress
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {run.started} · {run.count}
              </p>
              <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-brand transition-all"
                  style={{ width: `${run.progress}%` }}
                />
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="shrink-0"
              onClick={() => navigate("/chat")}
            >
              View
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
