import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Folder, MessageSquare, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/lib/projects-data";
import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700",
  teal: "bg-teal-100 text-teal-700",
  indigo: "bg-indigo-100 text-indigo-600",
};

function contextColor(pct: number) {
  if (pct >= 80) return "bg-[#e5484d]";
  if (pct >= 50) return "bg-amber-500";
  return "bg-teal-500";
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find((p) => p.id === id);

  const [instructions, setInstructions] = useState(project?.instructions ?? "");
  const [saved, setSaved] = useState(true);

  if (!project) return <Navigate to="/projects" replace />;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-7">
      <button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Projects
      </button>

      {/* header */}
      <div className="mt-4 flex items-center gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            toneMap[project.tone]
          )}
        >
          <Folder className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {project.name}
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground/70">
            {project.updated}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {project.summary}
      </p>

      {/* instructions */}
      <section className="mt-6 rounded-xl border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold">Project instructions</h2>
          <Button
            size="sm"
            variant={saved ? "outline" : "default"}
            disabled={saved}
            onClick={() => setSaved(true)}
          >
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Mateos follows these in every chat inside this project.
        </p>
        <textarea
          value={instructions}
          onChange={(e) => {
            setInstructions(e.target.value);
            setSaved(false);
          }}
          rows={3}
          placeholder="e.g. Always propose a next step. Keep drafts short and specific."
          className="mt-3 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
        />
      </section>

      {/* conversations */}
      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold">
            Chats
            <span className="ml-1.5 font-sans text-xs font-medium text-muted-foreground">
              {project.conversations.length}
            </span>
          </h2>
          <Button size="sm" variant="outline" onClick={() => navigate("/chat")}>
            <Plus className="h-4 w-4" />
            New chat
          </Button>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {project.conversations.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3"
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.updated}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", contextColor(c.contextPct))}
                      style={{ width: `${c.contextPct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] font-semibold tabular-nums text-muted-foreground">
                    {c.contextPct}%
                  </span>
                </div>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wide text-muted-foreground/60">
                  Context used
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
