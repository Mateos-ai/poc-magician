import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Lightbulb,
  Loader2,
  type LucideIcon,
  MessagesSquare,
  Telescope,
  ThumbsDown,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  type InsightSource,
  SOURCE_LABEL,
  useInsights,
} from "@/lib/insights-store";
import { cn } from "@/lib/utils";

const SOURCES: { key: InsightSource; title: string; sub: string; icon: LucideIcon }[] = [
  { key: "rejections", title: "Learn from rejections", sub: "Review the leads you passed on", icon: ThumbsDown },
  { key: "conversations", title: "Learn from chats", sub: "Mine your conversations for patterns", icon: MessagesSquare },
  { key: "research", title: "Deep research", sub: "Research your market & accounts", icon: Telescope },
];

const sourceBadge: Record<InsightSource, string> = {
  rejections: "border-[#f3c4c6] bg-[#FCE9EA] text-[#b3262b]",
  conversations: "border-indigo-200 bg-indigo-50 text-indigo-700",
  research: "border-teal-200 bg-teal-50 text-teal-800",
};

export default function Insights() {
  const { insights, confirmInsight, dismissInsight, runSource } = useInsights();
  const [scanning, setScanning] = useState<InsightSource | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  function scan(source: InsightSource) {
    if (scanning) return;
    setScanning(source);
    window.setTimeout(() => {
      runSource(source);
      setScanning(null);
    }, 1300);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-7">
      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Insights
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mateos spots patterns in how you sell. Confirm the ones that ring true
          and they become lasting{" "}
          <Link to="/assumptions" className="font-semibold text-amber-700 hover:underline">
            Assumptions
          </Link>
          .
        </p>
      </header>

      {/* source actions */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {SOURCES.map((s) => {
          const busy = scanning === s.key;
          return (
            <button
              key={s.key}
              onClick={() => scan(s.key)}
              disabled={!!scanning}
              className="flex flex-col items-start gap-2 rounded-xl border bg-card p-4 text-left shadow-xs transition-colors hover:border-primary hover:bg-amber-50/40 disabled:opacity-60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground">
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                ) : (
                  <s.icon className="h-4 w-4" />
                )}
              </span>
              <span className="text-sm font-bold">{s.title}</span>
              <span className="text-xs text-muted-foreground">
                {busy ? "Scanning…" : s.sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* insights list */}
      <div className="mt-7 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold">
          New insights
          <span className="ml-1.5 font-sans text-xs font-medium text-muted-foreground">
            {insights.length}
          </span>
        </h2>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {insights.length === 0 && (
          <div className="rounded-xl border border-dashed bg-card/40 px-4 py-8 text-center text-sm text-muted-foreground">
            All caught up. Run one of the scans above to look for more.
          </div>
        )}

        {insights.map((ins) => {
          const open = reviewing === ins.id;
          return (
            <div key={ins.id} className="rounded-xl border bg-card p-4 shadow-xs">
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Lightbulb className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{ins.title}</p>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        sourceBadge[ins.source]
                      )}
                    >
                      {SOURCE_LABEL[ins.source]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {ins.detail}
                  </p>
                </div>
                {!open && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    onClick={() => {
                      setReviewing(ins.id);
                      setDraft(ins.assumption.text);
                    }}
                  >
                    Review
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {open && (
                <div className="mt-3 rounded-lg border bg-muted/30 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    If you confirm, Mateos will remember
                  </p>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        dismissInsight(ins.id);
                        setReviewing(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        confirmInsight(ins.id, draft);
                        setReviewing(null);
                      }}
                    >
                      <Check className="h-4 w-4" />
                      Confirm & remember
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
