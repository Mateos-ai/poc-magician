import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  type LucideIcon,
  Send,
  Sparkles,
  Target,
} from "lucide-react";

import {
  ApolloLogo,
  GmailLogo,
  GoogleCalendarLogo,
  HubSpotLogo,
} from "@/components/brand/integration-logos";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StatusKey = "review" | "draft" | "task" | "progress" | "flagged";

const STATUS: Record<StatusKey, { label: string; cls: string }> = {
  review: { label: "Needs review", cls: "border-amber-200 bg-amber-50 text-amber-800" },
  draft: { label: "Draft ready", cls: "border-teal-200 bg-teal-50 text-teal-800" },
  task: { label: "To prep", cls: "border-indigo-200 bg-indigo-50 text-indigo-700" },
  progress: { label: "In progress", cls: "border-teal-200 bg-teal-50 text-teal-800" },
  flagged: { label: "Flagged", cls: "border-[#f3c4c6] bg-[#FCE9EA] text-[#b3262b]" },
};

type Filter = "all" | "needs-you" | "in-progress";

type Item = {
  id: string;
  kind: "needs-you" | "in-progress";
  logo?: ReactNode;
  icon?: LucideIcon;
  tone?: string;
  title: string;
  meta: string;
  status: StatusKey;
  action: string;
  actionIcon: LucideIcon;
  primary?: boolean;
  to?: string;
  progress?: number;
};

const toneMap: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700",
  teal: "bg-teal-100 text-teal-700",
  rose: "bg-[#FCE9EA] text-[#b3262b]",
};

const ITEMS: Item[] = [
  {
    id: "leads",
    kind: "needs-you",
    icon: Target,
    tone: "teal",
    title: "12 new leads ready to review",
    meta: "Lead-Gen run · found 12 companies like your best customers overnight",
    status: "review",
    action: "Review leads",
    actionIcon: ArrowRight,
    primary: true,
    to: "/top-funnel",
  },
  {
    id: "prep",
    kind: "needs-you",
    logo: <GoogleCalendarLogo className="h-6 w-6" />,
    title: "Prep for your 1:30 intro call · Meridian Talent",
    meta: "Starts in 2 hours · Mateos can pull a one-page brief on the attendees",
    status: "task",
    action: "Prepare with Mateos",
    actionIcon: Sparkles,
    primary: true,
    to: "/chat",
  },
  {
    id: "draft",
    kind: "needs-you",
    logo: <GmailLogo className="h-6 w-6" />,
    title: "Reply to Dana drafted · Harlow & Co.",
    meta: "“Can you send over the proposal?” · drafted and waiting for your send",
    status: "draft",
    action: "Review & send",
    actionIcon: Send,
    to: "/chat",
  },
  {
    id: "flagged",
    kind: "needs-you",
    icon: AlertTriangle,
    tone: "rose",
    title: "Northwind deal has gone quiet",
    meta: "$24k · no reply in 6 days · Mateos drafted a nudge",
    status: "flagged",
    action: "Review nudge",
    actionIcon: ArrowRight,
    to: "/chat",
  },
  {
    id: "expansion",
    kind: "in-progress",
    logo: <HubSpotLogo className="h-6 w-6" />,
    title: "Scanning your accounts for expansion signals",
    meta: "Mateos started this · 23 of 40 accounts checked",
    status: "progress",
    action: "View",
    actionIcon: ArrowRight,
    to: "/chat",
    progress: 58,
  },
  {
    id: "research",
    kind: "in-progress",
    logo: <ApolloLogo className="h-6 w-6" />,
    title: "Researching attendees before the SaaStr meetup",
    meta: "Mateos started this · 8 of 20 people enriched",
    status: "progress",
    action: "View",
    actionIcon: ArrowRight,
    to: "/chat",
    progress: 40,
  },
];

export default function Inbox() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");

  const needsYou = ITEMS.filter((i) => i.kind === "needs-you").length;
  const inProgress = ITEMS.filter((i) => i.kind === "in-progress").length;
  const shown = ITEMS.filter((i) => filter === "all" || i.kind === filter);

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: ITEMS.length },
    { key: "needs-you", label: "Needs you", count: needsYou },
    { key: "in-progress", label: "Mateos is on it", count: inProgress },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-7">
      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          What's now
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discoveries Mateos started, and the handful of things that need you
          right now.
        </p>
      </header>

      {/* filter */}
      <div className="mt-5 flex gap-1 rounded-lg border border-border bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-semibold transition-colors",
              filter === t.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-[10px] font-bold",
                filter === t.key
                  ? "bg-muted text-muted-foreground"
                  : "bg-card text-muted-foreground"
              )}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* list */}
      <div className="mt-4 flex flex-col gap-2.5">
        {shown.map((item) => (
          <ItemRow key={item.id} item={item} onAction={() => item.to && navigate(item.to)} />
        ))}
      </div>
    </div>
  );
}

function ItemRow({ item, onAction }: { item: Item; onAction: () => void }) {
  const status = STATUS[item.status];
  return (
    <div className="flex items-center gap-3.5 rounded-lg border bg-card p-4 shadow-xs transition-shadow hover:shadow-sm">
      {/* icon / logo */}
      {item.logo ? (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-card shadow-xs">
          {item.logo}
        </span>
      ) : (
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            toneMap[item.tone ?? "amber"]
          )}
        >
          {item.icon && <item.icon className="h-5 w-5" />}
        </span>
      )}

      {/* body */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold">{item.title}</p>
          <span
            className={cn(
              "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              status.cls
            )}
          >
            {item.kind === "in-progress" && (
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
            )}
            {status.label}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.meta}</p>

        {typeof item.progress === "number" && (
          <div className="mt-2 h-1.5 w-40 max-w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-brand transition-all"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* action */}
      <Button
        size="sm"
        variant={item.primary ? "default" : "outline"}
        className="shrink-0"
        onClick={onAction}
      >
        {item.action}
        <item.actionIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
