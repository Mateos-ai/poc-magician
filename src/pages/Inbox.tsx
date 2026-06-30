import { type ReactNode } from "react";
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
  GmailLogo,
  GoogleCalendarLogo,
} from "@/components/brand/integration-logos";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StatusKey = "review" | "draft" | "task" | "flagged";

const STATUS: Record<StatusKey, { label: string; cls: string }> = {
  review: { label: "Needs review", cls: "border-amber-200 bg-amber-50 text-amber-800" },
  draft: { label: "Draft ready", cls: "border-teal-200 bg-teal-50 text-teal-800" },
  task: { label: "To prep", cls: "border-indigo-200 bg-indigo-50 text-indigo-700" },
  flagged: { label: "Flagged", cls: "border-[#f3c4c6] bg-[#FCE9EA] text-[#b3262b]" },
};

const toneMap: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700",
  teal: "bg-teal-100 text-teal-700",
  rose: "bg-[#FCE9EA] text-[#b3262b]",
};

type Item = {
  id: string;
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
};

const ITEMS: Item[] = [
  {
    id: "leads",
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
    logo: <GoogleCalendarLogo className="h-6 w-6" />,
    title: "Prep for your 1:30 intro call · Meridian Talent",
    meta: "Starts in 2 hours · Mateos can pull a one-page brief on the attendees",
    status: "task",
    action: "Prepare with Mateos",
    actionIcon: Sparkles,
    primary: true,
    to: "/prepare-day",
  },
  {
    id: "draft",
    logo: <GmailLogo className="h-6 w-6" />,
    title: "Reply to Dana drafted · Harlow & Co.",
    meta: "“Can you send over the proposal?” · drafted and waiting for your send",
    status: "draft",
    action: "Review & send",
    actionIcon: Send,
    to: "/prepare-day",
  },
  {
    id: "flagged",
    icon: AlertTriangle,
    tone: "rose",
    title: "Northwind deal has gone quiet",
    meta: "$24k · no reply in 6 days · Mateos drafted a nudge",
    status: "flagged",
    action: "Review nudge",
    actionIcon: ArrowRight,
    to: "/prepare-day",
  },
];

export default function Inbox() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-7">
      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Take action
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The things that need you right now — review, send, or prep with Mateos.
        </p>
      </header>

      <div className="mt-5 flex flex-col gap-2.5">
        {ITEMS.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            onAction={() => item.to && navigate(item.to)}
          />
        ))}
      </div>
    </div>
  );
}

function ItemRow({ item, onAction }: { item: Item; onAction: () => void }) {
  const status = STATUS[item.status];
  return (
    <div className="flex items-center gap-3.5 rounded-lg border bg-card p-4 shadow-xs transition-shadow hover:shadow-sm">
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

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold">{item.title}</p>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              status.cls
            )}
          >
            {status.label}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.meta}</p>
      </div>

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
