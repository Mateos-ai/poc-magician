import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Pencil, Plus, Sparkles, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { GROUP_ORDER, useInsights } from "@/lib/insights-store";
import { cn } from "@/lib/utils";

function sourceTint(source: string) {
  const s = source.toLowerCase();
  if (s.includes("rejection")) return "border-[#f3c4c6] bg-[#FCE9EA] text-[#b3262b]";
  if (s.includes("conversation")) return "border-indigo-200 bg-indigo-50 text-indigo-700";
  if (s.includes("research")) return "border-teal-200 bg-teal-50 text-teal-800";
  if (s.includes("closed-won")) return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-border bg-muted text-muted-foreground";
}

export default function Assumptions() {
  const { assumptions, addAssumption, removeAssumption } = useInsights();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleGroup = (group: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(group) ? next.delete(group) : next.add(group);
      return next;
    });

  // Group assumptions, ordered by GROUP_ORDER then any extras.
  const grouped = useMemo(() => {
    const byGroup = new Map<string, typeof assumptions>();
    for (const a of assumptions) {
      const list = byGroup.get(a.group) ?? [];
      list.push(a);
      byGroup.set(a.group, list);
    }
    const ordered = [...byGroup.keys()].sort((x, y) => {
      const ix = GROUP_ORDER.indexOf(x);
      const iy = GROUP_ORDER.indexOf(y);
      return (ix === -1 ? 99 : ix) - (iy === -1 ? 99 : iy);
    });
    return ordered.map((g) => ({ group: g, items: byGroup.get(g)! }));
  }, [assumptions]);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-7">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Assumptions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            What Mateos believes about your business and how it sells. Confirmed
            insights land here - correct anything that's off.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add assumption
        </Button>
      </header>

      <div className="mt-6 flex flex-col gap-6">
        {grouped.map(({ group, items }) => {
          const isCollapsed = collapsed.has(group);
          return (
          <section key={group}>
            <button
              onClick={() => toggleGroup(group)}
              className="group/head flex w-full items-center gap-1.5 py-0.5 text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  isCollapsed && "-rotate-90"
                )}
              />
              <h2 className="font-mono text-[10px] uppercase tracking-wider">
                {group}
                <span className="ml-1.5">· {items.length}</span>
              </h2>
            </button>
            {!isCollapsed && (
            <div className="mt-2 flex flex-col gap-2">
              {items.map((a) => (
                <div
                  key={a.id}
                  className="group flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5 shadow-xs"
                >
                  <p className="min-w-0 flex-1 text-sm">{a.text}</p>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      sourceTint(a.source)
                    )}
                  >
                    {a.source}
                  </span>
                  <button
                    onClick={() => removeAssumption(a.id)}
                    title="Remove"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-destructive group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            )}
          </section>
          );
        })}
      </div>

      {open && (
        <AddAssumptionModal
          onClose={() => setOpen(false)}
          onAdd={(group, text) => {
            addAssumption(group, text);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function AddAssumptionModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (group: string, text: string) => void;
}) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"choice" | "manual">("choice");
  const [group, setGroup] = useState(GROUP_ORDER[0]);
  const [text, setText] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <button className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
        <h3 className="font-display text-lg font-bold tracking-tight">
          Add an assumption
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "choice"
            ? "Tell Mateos something it should remember about your business."
            : "Write it yourself - Mateos will apply it everywhere."}
        </p>

        {mode === "choice" ? (
          <div className="mt-5 flex flex-col gap-2.5">
            <button
              onClick={() => setMode("manual")}
              className="flex items-center gap-3 rounded-lg border bg-card p-3.5 text-left transition-colors hover:border-primary hover:bg-amber-50/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Pencil className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Write it yourself</p>
                <p className="text-xs text-muted-foreground">Type a fact and pick a category.</p>
              </div>
            </button>
            <button
              onClick={() => {
                onClose();
                navigate("/chat");
              }}
              className="flex items-center gap-3 rounded-lg border bg-card p-3.5 text-left transition-colors hover:border-primary hover:bg-amber-50/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border bg-card shadow-xs">
                <Logo className="h-4 w-4" />
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  Talk it through with Mateos
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                </p>
                <p className="text-xs text-muted-foreground">
                  Describe it in a chat and Mateos writes the assumption.
                </p>
              </div>
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) onAdd(group, text);
            }}
            className="mt-5 flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Category</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
              >
                {GROUP_ORDER.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Assumption</label>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={2}
                placeholder="e.g. Deals over $50k always need a security review."
                className="resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
              />
            </div>
            <div className="mt-1 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setMode("choice")}>
                Back
              </Button>
              <Button type="submit" disabled={!text.trim()}>
                Add assumption
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
