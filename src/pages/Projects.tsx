import { useNavigate } from "react-router-dom";
import { Folder, MessageSquare, Plus } from "lucide-react";

import { PROJECTS } from "@/lib/projects-data";
import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700",
  teal: "bg-teal-100 text-teal-700",
  indigo: "bg-indigo-100 text-indigo-600",
};

export default function Projects() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-7">
      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Projects
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Group related chats, context and files so Mateos keeps the thread
          across a whole initiative.
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* new project tile */}
        <button className="flex min-h-[148px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:bg-amber-50/40 hover:text-amber-700">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed">
            <Plus className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold">New project</span>
        </button>

        {PROJECTS.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}`)}
            className="flex flex-col rounded-xl border bg-card p-4 text-left shadow-xs transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  toneMap[p.tone]
                )}
              >
                <Folder className="h-4 w-4" />
              </span>
              <p className="min-w-0 flex-1 truncate font-display text-sm font-bold">
                {p.name}
              </p>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {p.conversations.length}
              </span>
            </div>

            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
              {p.description}
            </p>

            <ul className="mt-3 space-y-1.5 border-t pt-3">
              {p.conversations.slice(0, 2).map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-2 text-xs text-foreground/80"
                >
                  <MessageSquare className="h-3 w-3 shrink-0 text-muted-foreground" />
                  <span className="truncate">{c.title}</span>
                </li>
              ))}
            </ul>

            <p className="mt-3 font-mono text-[10px] uppercase tracking-wide text-muted-foreground/60">
              {p.updated}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
