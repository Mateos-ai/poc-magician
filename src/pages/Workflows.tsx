import { useRef, useState, type ReactNode } from "react";
import { Check, Copy, Pencil, Plus, Trash2, Zap } from "lucide-react";

import {
  GmailLogo,
  GoogleCalendarLogo,
  HubSpotLogo,
} from "@/components/brand/integration-logos";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppKey = "hubspot" | "gmail" | "calendar";
const APP: Record<AppKey, { node: ReactNode; label: string }> = {
  hubspot: { node: <HubSpotLogo className="h-4 w-4" />, label: "HubSpot" },
  gmail: { node: <GmailLogo className="h-4 w-4" />, label: "Gmail" },
  calendar: { node: <GoogleCalendarLogo className="h-4 w-4" />, label: "Google Calendar" },
};

type Workflow = {
  id: string;
  name: string;
  description: string;
  trigger: string;
  apps: AppKey[];
  enabled: boolean;
  draft?: boolean;
};

const INITIAL: Workflow[] = [
  {
    id: "w1",
    name: "Create automatic sales proposals",
    description:
      "When a deal reaches the Proposal stage, draft a tailored proposal and queue it for your review.",
    trigger: "Deal moves to “Proposal”",
    apps: ["hubspot", "gmail"],
    enabled: true,
  },
  {
    id: "w2",
    name: "Update participants after meeting",
    description:
      "After each call, log the notes and update the contact + deal records from what was discussed.",
    trigger: "Calendar event ends",
    apps: ["calendar", "hubspot"],
    enabled: true,
  },
  {
    id: "w3",
    name: "Prep briefs before every meeting",
    description:
      "An hour before each external meeting, compile a one-page brief on the attendees and the account.",
    trigger: "1 hour before a meeting",
    apps: ["calendar", "hubspot", "gmail"],
    enabled: true,
  },
  {
    id: "w4",
    name: "Draft follow-ups for quiet deals",
    description:
      "When a deal goes 5 days without activity, draft a light nudge and add it to Take Action.",
    trigger: "5 days with no activity",
    apps: ["hubspot", "gmail"],
    enabled: false,
  },
];

export default function Workflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>(INITIAL);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Workflow | null>(null);
  const idRef = useRef(1);

  const update = (id: string, patch: Partial<Workflow>) =>
    setWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));

  function create() {
    const id = `new-${idRef.current++}`;
    setWorkflows((prev) => [
      { id, name: "New workflow", description: "", trigger: "Choose a trigger", apps: [], enabled: false, draft: true },
      ...prev,
    ]);
    setEditingId(id);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-7">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">Workflows</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The multi-step plays Mateos runs for you, hands-off, on a trigger or schedule.
          </p>
        </div>
        <Button onClick={create}>
          <Plus className="h-4 w-4" />
          Create new workflow
        </Button>
      </header>

      <div className="mt-6 flex flex-col gap-3">
        {workflows.map((w) => {
          const editing = editingId === w.id;
          return (
            <div key={w.id} className="rounded-xl border bg-card p-4 shadow-xs">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    w.enabled ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Zap className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  {editing ? (
                    <input
                      value={w.name}
                      onChange={(e) => update(w.id, { name: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-2.5 py-1 text-sm font-bold focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">{w.name}</p>
                      {w.draft && (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                          Draft
                        </span>
                      )}
                    </div>
                  )}

                  {editing ? (
                    <textarea
                      value={w.description}
                      onChange={(e) => update(w.id, { description: e.target.value })}
                      rows={2}
                      placeholder="What does this workflow do?"
                      className="mt-2 w-full resize-none rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
                    />
                  ) : (
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {w.description}
                    </p>
                  )}
                </div>

                {/* actions */}
                <div className="flex shrink-0 items-center gap-1">
                  {w.draft ? (
                    <Button
                      size="sm"
                      className="mr-1 h-7"
                      onClick={() => update(w.id, { draft: false, enabled: true })}
                    >
                      Publish
                    </Button>
                  ) : (
                    <Toggle on={w.enabled} onClick={() => update(w.id, { enabled: !w.enabled })} />
                  )}
                  <button
                    onClick={() => setEditingId(editing ? null : w.id)}
                    title={editing ? "Done" : "Edit"}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted",
                      editing ? "text-amber-700" : "text-muted-foreground"
                    )}
                  >
                    {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(w)}
                    title="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* footer: trigger + apps */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                <p className="text-[11px] text-muted-foreground">
                  <span className="font-mono uppercase tracking-wide text-muted-foreground/60">
                    Trigger ·{" "}
                  </span>
                  {w.trigger}
                </p>
                <div className="flex items-center gap-1.5">
                  {w.apps.length === 0 ? (
                    <span className="text-[11px] text-muted-foreground/60">No apps yet</span>
                  ) : (
                    w.apps.map((a) => (
                      <span
                        key={a}
                        title={APP[a].label}
                        className="flex h-6 w-6 items-center justify-center rounded-md border bg-card"
                      >
                        {APP[a].node}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {deleteTarget && (
        <DeleteWorkflowDialog
          name={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            setWorkflows((prev) => prev.filter((x) => x.id !== deleteTarget.id));
            if (editingId === deleteTarget.id) setEditingId(null);
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}

function DeleteWorkflowDialog({
  name,
  onClose,
  onConfirm,
}: {
  name: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const match = text.trim() === name.trim();

  const copy = () => {
    navigator.clipboard?.writeText(name);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <button className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FCE9EA]">
          <Trash2 className="h-5 w-5 text-destructive" />
        </div>
        <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
          Delete workflow?
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          This permanently removes the workflow and can't be undone. Type its
          name to confirm:
        </p>

        <div className="mt-3 flex items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-1.5">
          <code className="flex-1 select-all truncate text-sm font-semibold">{name}</code>
          <button
            onClick={copy}
            title="Copy name"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            {copied ? <Check className="h-4 w-4 text-teal-600" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && match) onConfirm();
          }}
          placeholder="Type the workflow name…"
          className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
        />

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={!match} onClick={onConfirm}>
            Delete workflow
          </Button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={on ? "On" : "Off"}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
        on ? "bg-teal-500" : "bg-muted-foreground/30"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
          on ? "left-4" : "left-0.5"
        )}
      />
    </button>
  );
}
