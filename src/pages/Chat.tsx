import { useRef, useState } from "react";
import {
  ArrowUp,
  CalendarClock,
  Compass,
  Folder,
  FolderInput,
  type LucideIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  CARD_INTRO,
  type CardKind,
  ResponseCard,
} from "@/components/chat/response-cards";
import { ThinkingTrace } from "@/components/chat/thinking-trace";
import { getProfile } from "@/lib/demo-store";
import { mateosSystem, streamMateos, type MateosMessage } from "@/lib/mateos";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  card?: CardKind;
  thinking?: CardKind;
};

const RECOMMENDATIONS: { label: string; icon: LucideIcon; card: CardKind }[] = [
  { label: "Prep me for today", icon: CalendarClock, card: "day" },
  { label: "Discover new opportunities", icon: TrendingUp, card: "opportunities" },
  { label: "Dive into strategy", icon: Compass, card: "strategy" },
  { label: "Get me new leads", icon: Target, card: "leads" },
];

const NEW_ID = "new";

const PROJECTS = ["Q3 Pipeline", "Recruiting ICP", "SaaStr 2026", "Enterprise Expansion"];

// Invented past conversations so the rail looks lived-in for demos.
const RECENT: { id: string; title: string; time: string; messages: [string, string][] }[] = [
  {
    id: "c1",
    title: "Leads like Meridian Talent",
    time: "2h ago",
    messages: [
      ["user", "Find me more companies like Meridian Talent."],
      [
        "assistant",
        "On it. Meridian's pattern: recruiting & staffing firms, 50–200 people, recently funded or hiring fast. I found 12 matches and scored them against your closed-won deals. Top three: Harlow & Co. (89), Atlas Partners (86), Northwind Group (81). Want outreach drafted for the strongest?",
      ],
      ["user", "Yes, draft one for Harlow & Co."],
      [
        "assistant",
        "Drafted — short, references their recent Series A and your work with similar firms. It's in your Take Action queue to review and send. Want the other two teed up as well?",
      ],
      ["user", "Just those two for now, thanks."],
      ["assistant", "Done. I'll hold the rest and flag any that start heating up."],
    ],
  },
  {
    id: "c2",
    title: "Northwind follow-up",
    time: "Yesterday",
    messages: [
      ["user", "Northwind has gone quiet. What should I do?"],
      [
        "assistant",
        "It's been 6 days since your pricing email. Deals at this stage usually need a light nudge, not pressure — I'd offer to answer questions before their team meets. Want me to draft it?",
      ],
      ["user", "Draft it, keep it casual."],
      [
        "assistant",
        "Here's a casual nudge — no hard ask, just keeping the door open. Drafted and waiting for your send. If they're still quiet in 4 days, a short break-up email tends to get a reply. Want me to queue one?",
      ],
      ["user", "Sure, queue it."],
      ["assistant", "Queued. I'll surface it in 4 days if there's no response."],
    ],
  },
  {
    id: "c3",
    title: "Prep · Harlow & Co. call",
    time: "Yesterday",
    messages: [
      ["user", "What do I need to know before my call with Harlow & Co.?"],
      [
        "assistant",
        "Quick brief: Dana Levin, Head of Talent, 3 years there. They're hiring for 6 senior roles, and your last thread was about the proposal. Two angles that land with firms like theirs: time-to-hire and quality of hire. Want a few discovery questions?",
      ],
      ["user", "Yes please."],
      [
        "assistant",
        "Three to open with: 1) What's slowing your senior hires down today? 2) How are you measuring quality of hire? 3) Who else weighs in when you adopt a new tool? Want me to drop these into the calendar event?",
      ],
      ["user", "Add them, thanks."],
      ["assistant", "Added to the 1:30 event notes."],
    ],
  },
  {
    id: "c4",
    title: "Q3 — where to focus",
    time: "Mon",
    messages: [
      ["user", "Where should I focus this quarter?"],
      [
        "assistant",
        "Your numbers are clear: recruiting firms close ~2× faster than your average and at a higher win rate. You also have 7 deals stalled past 30 days — clearing those is the quickest win. Want me to draft nudges for the stalled ones?",
      ],
      ["user", "How much is stuck in those 7?"],
      [
        "assistant",
        "$96k across the seven, with Northwind ($24k) the largest. Three look revivable this week. Want me to start with those three?",
      ],
      ["user", "Yes, start there."],
      ["assistant", "On it — drafting nudges for the top three now. They'll land in Take Action shortly."],
    ],
  },
  {
    id: "c5",
    title: "Outreach to fintech founders",
    time: "Last week",
    messages: [
      ["user", "I want to start reaching out to fintech founders. Can you help?"],
      [
        "assistant",
        "Fintech's a bit outside your usual recruiting ICP, so expect a lower hit rate — but founders hiring their first sales team are a fit. Want me to find a handful and draft a tailored opener?",
      ],
      ["user", "Find 5 and draft one opener I can reuse."],
      [
        "assistant",
        "Found 5 seed-stage fintechs hiring sales leaders. Here's a reusable opener that leads with your track record placing first sales hires — tweak the first line per founder and you're set. It's in Take Action.",
      ],
      ["user", "Great, that works."],
      ["assistant", "I'll keep an eye out for more as they start hiring."],
    ],
  },
];

export default function Chat() {
  const { name, workspace } = getProfile();
  const firstName = name.split(" ")[0];
  const system = mateosSystem(name, workspace);

  const greeting: ChatMessage = {
    id: 0,
    role: "assistant",
    content: `Hi ${firstName} 👋  I'm Mateos, your sales co-pilot. What should we work on? Here are a few things I can help with right now:`,
  };

  // Build initial message map: a fresh "new" chat + the canned recents.
  const initial: Record<string, ChatMessage[]> = { [NEW_ID]: [greeting] };
  for (const c of RECENT) {
    initial[c.id] = c.messages.map(([role, content], i) => ({
      id: i,
      role: role as "user" | "assistant",
      content,
    }));
  }

  const [convos, setConvos] = useState<Record<string, ChatMessage[]>>(initial);
  const [recents, setRecents] = useState(
    RECENT.map(({ id, title, time }) => ({ id, title, time }))
  );
  const [activeId, setActiveId] = useState<string>(NEW_ID);
  const [input, setInput] = useState("");
  const [streamingId, setStreamingId] = useState<string | null>(null);

  const idRef = useRef(1000);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = convos[activeId] ?? [];
  const streaming = streamingId === activeId;
  const isNew = activeId === NEW_ID;
  const showRecs = isNew && messages.length === 1 && !streaming;
  const activeTitle = isNew
    ? "New chat"
    : recents.find((c) => c.id === activeId)?.title ?? "Chat";

  const scrollToBottom = () =>
    requestAnimationFrame(() =>
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    );

  const updateConvo = (id: string, fn: (msgs: ChatMessage[]) => ChatMessage[]) =>
    setConvos((prev) => ({ ...prev, [id]: fn(prev[id] ?? []) }));

  function newChat() {
    setConvos((prev) => ({ ...prev, [NEW_ID]: [greeting] }));
    setActiveId(NEW_ID);
  }

  function renameConvo(id: string, title: string) {
    setRecents((prev) => prev.map((r) => (r.id === id ? { ...r, title } : r)));
  }

  // Used for both Delete and Move-to-project (both drop it from Recent).
  function removeConvo(id: string) {
    setRecents((prev) => prev.filter((r) => r.id !== id));
    if (activeId === id) setActiveId(NEW_ID);
  }

  // Recommendation buttons → tool trace, then a structured card.
  function submitCard(label: string, kind: CardKind) {
    if (streaming) return;
    const id = activeId;
    const userMsg: ChatMessage = { id: idRef.current++, role: "user", content: label };
    const assistantMsg: ChatMessage = {
      id: idRef.current++,
      role: "assistant",
      content: "",
      thinking: kind,
    };
    updateConvo(id, (msgs) => [...msgs, userMsg, assistantMsg]);
    setStreamingId(id);
    scrollToBottom();
  }

  function revealCard(convoId: string, msgId: number, kind: CardKind) {
    updateConvo(convoId, (msgs) =>
      msgs.map((m) =>
        m.id === msgId ? { ...m, content: CARD_INTRO[kind](firstName), card: kind } : m
      )
    );
    setStreamingId(null);
    scrollToBottom();
  }

  // Free-typed messages → live Claude stream.
  async function submit(value: string) {
    const text = value.trim();
    if (!text || streaming) return;

    const id = activeId;
    const userMsg: ChatMessage = { id: idRef.current++, role: "user", content: text };
    const assistantMsg: ChatMessage = { id: idRef.current++, role: "assistant", content: "" };
    const convo = [...(convos[id] ?? []), userMsg];

    updateConvo(id, () => [...convo, assistantMsg]);
    setInput("");
    setStreamingId(id);
    scrollToBottom();

    const apiMessages: MateosMessage[] = convo
      .filter((m, i) => !(i === 0 && m.role === "assistant"))
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      await streamMateos(apiMessages, system, (chunk) => {
        updateConvo(id, (msgs) =>
          msgs.map((m) => (m.id === assistantMsg.id ? { ...m, content: m.content + chunk } : m))
        );
        scrollToBottom();
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong talking to Mateos.";
      updateConvo(id, (msgs) =>
        msgs.map((m) => (m.id === assistantMsg.id ? { ...m, content: `⚠️ ${message}` } : m))
      );
    } finally {
      setStreamingId(null);
      scrollToBottom();
    }
  }

  return (
    <div className="flex h-full">
      {/* ── Recent conversations rail ───────────────────────── */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-muted/20 lg:flex">
        <div className="p-3">
          <Button variant="outline" className="w-full justify-start" onClick={newChat}>
            <Plus className="h-4 w-4" />
            New chat
          </Button>
        </div>
        <p className="px-4 pb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/55">
          Recent
        </p>
        <div className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
          {recents.map((c) => (
            <RailItem
              key={c.id}
              title={c.title}
              time={c.time}
              snippet={convos[c.id]?.[convos[c.id].length - 1]?.content ?? ""}
              active={c.id === activeId}
              onSelect={() => setActiveId(c.id)}
              onRename={(t) => renameConvo(c.id, t)}
              onDelete={() => removeConvo(c.id)}
              onMove={() => removeConvo(c.id)}
            />
          ))}
          {recents.length === 0 && (
            <p className="px-2.5 py-3 text-[11px] text-muted-foreground">
              No recent chats. Start a new one above.
            </p>
          )}
        </div>
      </aside>

      {/* ── Conversation ────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="flex h-11 shrink-0 items-center gap-2 border-b bg-card/60 px-5 backdrop-blur">
          <span className="flex h-6 w-6 items-center justify-center rounded-md border bg-card shadow-xs">
            <Logo className="h-3.5 w-3.5" />
          </span>
          <p className="truncate font-display text-sm font-bold">{activeTitle}</p>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6">
            {messages.map((m, i) => {
              const isLast = i === messages.length - 1;
              const isPending =
                m.role === "assistant" &&
                m.content === "" &&
                !m.thinking &&
                streaming &&
                isLast;

              if (m.thinking) {
                return (
                  <div key={m.id} className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-card shadow-xs">
                        <Logo className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 max-w-[88%] flex-1">
                        <ThinkingTrace
                          kind={m.thinking}
                          done={!!m.card}
                          onDone={() => revealCard(activeId, m.id, m.thinking!)}
                        />
                      </div>
                    </div>
                    {m.card && (
                      <div className="ml-11 flex max-w-[88%] flex-col gap-2.5">
                        <p className="text-sm leading-relaxed">{m.content}</p>
                        <ResponseCard kind={m.card} />
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={m.id}>
                  <MessageRow message={m} name={name} pending={isPending} />
                  {m.id === 0 && showRecs && (
                    <div className="ml-11 mt-3 flex flex-wrap gap-2">
                      {RECOMMENDATIONS.map((r) => (
                        <button
                          key={r.label}
                          onClick={() => submitCard(r.label, r.card)}
                          className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-semibold text-foreground shadow-xs transition-colors hover:border-primary hover:bg-amber-50 hover:text-amber-800"
                        >
                          <r.icon className="h-4 w-4 text-amber-600" />
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* composer */}
        <div className="border-t bg-card/80 backdrop-blur">
          <div className="mx-auto w-full max-w-3xl px-4 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={streaming}
                placeholder={`Ask Mateos anything about selling at ${workspace}…`}
                className="h-11 flex-1 rounded-xl border border-input bg-background px-4 text-sm transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100 disabled:opacity-60"
              />
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 rounded-xl"
                disabled={streaming || !input.trim()}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Live demo · Mateos is really talking to Claude, but has no access to
              your actual inbox, calendar or CRM yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuBtn({
  icon: Icon,
  label,
  onClick,
  danger,
  chevron,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  danger?: boolean;
  chevron?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] font-medium transition-colors hover:bg-muted",
        danger ? "text-destructive" : "text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="flex-1">{label}</span>
      {chevron && <span className="text-muted-foreground">›</span>}
    </button>
  );
}

function RailItem({
  title,
  time,
  snippet,
  active,
  onSelect,
  onRename,
  onDelete,
  onMove,
}: {
  title: string;
  time: string;
  snippet: string;
  active: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  onMove: (project: string) => void;
}) {
  const [menu, setMenu] = useState<null | "root" | "projects">(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  const commit = () => {
    const t = draft.trim();
    if (t) onRename(t);
    setEditing(false);
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-1 rounded-md pr-1",
        active ? "bg-amber-50" : "hover:bg-muted"
      )}
    >
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          onBlur={commit}
          className="m-1 h-8 flex-1 rounded-md border border-primary bg-background px-2 text-[13px] font-semibold focus-visible:outline-none"
        />
      ) : (
        <button onClick={onSelect} className="min-w-0 flex-1 px-2.5 py-2 text-left">
          <span
            className={cn(
              "block truncate text-[13px] font-semibold",
              active && "text-amber-900"
            )}
          >
            {title}
          </span>
          <span className="block truncate text-[11px] text-muted-foreground">
            {time} · {snippet}
          </span>
        </button>
      )}

      {!editing && (
        <button
          onClick={() => setMenu("root")}
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-opacity hover:bg-background hover:text-foreground",
            menu ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      )}

      {menu && (
        <>
          <button
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setMenu(null)}
            aria-hidden
          />
          <div className="absolute right-1 top-9 z-50 w-44 rounded-lg border bg-popover p-1 shadow-lg">
            {menu === "root" ? (
              <>
                <MenuBtn
                  icon={Pencil}
                  label="Rename"
                  onClick={() => {
                    setDraft(title);
                    setEditing(true);
                    setMenu(null);
                  }}
                />
                <MenuBtn
                  icon={FolderInput}
                  label="Move to project"
                  chevron
                  onClick={() => setMenu("projects")}
                />
                <MenuBtn
                  icon={Trash2}
                  label="Delete"
                  danger
                  onClick={() => {
                    setMenu(null);
                    onDelete();
                  }}
                />
              </>
            ) : (
              <>
                <p className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                  Move to…
                </p>
                {PROJECTS.map((p) => (
                  <MenuBtn
                    key={p}
                    icon={Folder}
                    label={p}
                    onClick={() => {
                      setMenu(null);
                      onMove(p);
                    }}
                  />
                ))}
                <div className="my-1 h-px bg-border" />
                <MenuBtn
                  icon={Plus}
                  label="New project"
                  onClick={() => {
                    setMenu(null);
                    onMove("New project");
                  }}
                />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MessageRow({
  message,
  name,
  pending,
}: {
  message: ChatMessage;
  name: string;
  pending: boolean;
}) {
  const isMateos = message.role === "assistant";
  return (
    <div className={cn("flex gap-3", isMateos ? "justify-start" : "justify-end")}>
      {isMateos && (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-card shadow-xs">
          <Logo className="h-4 w-4" />
        </span>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isMateos
            ? "rounded-tl-sm bg-card text-card-foreground shadow-sm"
            : "rounded-tr-sm bg-secondary text-secondary-foreground"
        )}
      >
        {pending ? (
          <span className="flex items-center gap-1 py-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        ) : (
          <span className="whitespace-pre-wrap">{message.content}</span>
        )}
      </div>

      {!isMateos && (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-secondary-foreground">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
