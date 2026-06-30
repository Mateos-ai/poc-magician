import { useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowUp,
  type LucideIcon,
  Target,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import {
  GmailLogo,
  GoogleCalendarLogo,
} from "@/components/brand/integration-logos";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/demo-store";
import { mateosSystem, streamMateos, type MateosMessage } from "@/lib/mateos";
import { cn } from "@/lib/utils";

type Msg = { id: number; role: "user" | "assistant"; content: string };

type StatusKey = "meeting" | "draft" | "flagged" | "review";
const STATUS: Record<StatusKey, { label: string; cls: string }> = {
  meeting: { label: "Meeting", cls: "border-indigo-200 bg-indigo-50 text-indigo-700" },
  draft: { label: "Draft ready", cls: "border-teal-200 bg-teal-50 text-teal-800" },
  flagged: { label: "Flagged", cls: "border-[#f3c4c6] bg-[#FCE9EA] text-[#b3262b]" },
  review: { label: "Needs review", cls: "border-amber-200 bg-amber-50 text-amber-800" },
};

const toneMap: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700",
  teal: "bg-teal-100 text-teal-700",
  rose: "bg-[#FCE9EA] text-[#b3262b]",
};

type AgendaItem = {
  id: string;
  logo?: ReactNode;
  icon?: LucideIcon;
  tone?: string;
  title: string;
  time: string;
  status: StatusKey;
  context: string;
  opener: string;
  chips: string[];
};

const AGENDA: AgendaItem[] = [
  {
    id: "meeting",
    logo: <GoogleCalendarLogo className="h-5 w-5" />,
    title: "Intro call · Meridian Talent",
    time: "1:30 PM · 30 min",
    status: "meeting",
    context:
      "A 1:30 PM intro call with a VP of People at Meridian Talent the user hasn't met before. Goal: a strong first meeting.",
    opener:
      "Your 1:30 with Meridian Talent — a VP of People you haven't met yet. I can pull a prep brief on them, or draft a few discovery questions. Where do you want to start?",
    chips: ["Build a prep brief", "Draft discovery questions", "Who am I meeting?"],
  },
  {
    id: "email",
    logo: <GmailLogo className="h-5 w-5" />,
    title: "Reply to Dana · Harlow & Co.",
    time: "Due today",
    status: "draft",
    context:
      "Dana at Harlow & Co. asked the user to send over the proposal. A reply is already drafted and waiting to be sent.",
    opener:
      "Dana asked you to send over the proposal — I've got a reply drafted. Want to review it, soften the ask, or send it as-is?",
    chips: ["Show me the draft", "Make it warmer", "Looks good — send it"],
  },
  {
    id: "northwind",
    icon: AlertTriangle,
    tone: "rose",
    title: "Northwind has gone quiet",
    time: "No reply · 6 days",
    status: "flagged",
    context:
      "The Northwind deal ($24k) has had no reply in 6 days and is at risk of going cold.",
    opener:
      "Northwind's been quiet for 6 days now, with $24k on the line. A light, low-pressure nudge tends to work here — want me to draft one?",
    chips: ["Draft a nudge", "Why might it have stalled?", "Draft a break-up email"],
  },
  {
    id: "leads",
    icon: Target,
    tone: "teal",
    title: "12 new leads to review",
    time: "Found overnight",
    status: "review",
    context:
      "Mateos found 12 new leads overnight that match the user's ideal-customer profile.",
    opener:
      "12 new leads came in overnight that look like your best customers. Want the top three, or should I draft outreach for the strongest one?",
    chips: ["Show me the top 3", "Draft outreach for #1", "Why these leads?"],
  },
];

export default function PrepareDay() {
  const { name, workspace } = getProfile();
  const baseSystem = mateosSystem(name, workspace);
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const [selectedId, setSelectedId] = useState(AGENDA[0].id);
  const [threads, setThreads] = useState<Record<string, Msg[]>>(() => ({
    [AGENDA[0].id]: [{ id: 0, role: "assistant", content: AGENDA[0].opener }],
  }));
  const [input, setInput] = useState("");
  const [streamingId, setStreamingId] = useState<string | null>(null);

  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const item = AGENDA.find((a) => a.id === selectedId)!;
  const thread = threads[selectedId] ?? [];
  const streaming = streamingId === selectedId;

  const scrollToBottom = () =>
    requestAnimationFrame(() =>
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    );

  function selectItem(id: string) {
    setSelectedId(id);
    setThreads((prev) =>
      prev[id]
        ? prev
        : {
            ...prev,
            [id]: [
              { id: 0, role: "assistant", content: AGENDA.find((a) => a.id === id)!.opener },
            ],
          }
    );
    scrollToBottom();
  }

  const updateThread = (id: string, fn: (msgs: Msg[]) => Msg[]) =>
    setThreads((prev) => ({ ...prev, [id]: fn(prev[id] ?? []) }));

  async function send(value: string) {
    const text = value.trim();
    if (!text || streaming) return;

    const id = selectedId;
    const userMsg: Msg = { id: idRef.current++, role: "user", content: text };
    const assistantMsg: Msg = { id: idRef.current++, role: "assistant", content: "" };
    const convo = [...thread, userMsg];

    updateThread(id, () => [...convo, assistantMsg]);
    setInput("");
    setStreamingId(id);
    scrollToBottom();

    const system = `${baseSystem}\n\nThe user is working through this item from today's agenda: ${item.context} Keep replies tight and action-oriented, and offer to draft or take the next concrete step.`;
    const apiMessages: MateosMessage[] = convo
      .filter((m, i) => !(i === 0 && m.role === "assistant"))
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      await streamMateos(apiMessages, system, (chunk) => {
        updateThread(id, (msgs) =>
          msgs.map((m) => (m.id === assistantMsg.id ? { ...m, content: m.content + chunk } : m))
        );
        scrollToBottom();
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong talking to Mateos.";
      updateThread(id, (msgs) =>
        msgs.map((m) => (m.id === assistantMsg.id ? { ...m, content: `⚠️ ${message}` } : m))
      );
    } finally {
      setStreamingId(null);
      scrollToBottom();
    }
  }

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* ── Agenda ──────────────────────────────────────────── */}
      <aside className="shrink-0 border-b lg:w-[340px] lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="px-4 py-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
            {dateStr}
          </p>
          <h1 className="mt-0.5 font-display text-xl font-extrabold tracking-tight">
            Prepare my day
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {AGENDA.length} things to get ahead of. Pick one to dig in with Mateos.
          </p>
        </div>

        <ul className="flex gap-2 overflow-x-auto px-3 pb-3 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-2">
          {AGENDA.map((a) => {
            const active = a.id === selectedId;
            const status = STATUS[a.status];
            return (
              <li key={a.id} className="shrink-0 lg:shrink">
                <button
                  onClick={() => selectItem(a.id)}
                  className={cn(
                    "flex w-64 items-start gap-3 rounded-lg border p-3 text-left transition-colors lg:w-full",
                    active
                      ? "border-primary bg-amber-50/60"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  {a.logo ? (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-card shadow-xs">
                      {a.logo}
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        toneMap[a.tone ?? "amber"]
                      )}
                    >
                      {a.icon && <a.icon className="h-4 w-4" />}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.time}</p>
                    <span
                      className={cn(
                        "mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        status.cls
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* ── Conversation ────────────────────────────────────── */}
      <section className="flex min-h-0 flex-1 flex-col">
        {/* header */}
        <header className="flex items-center gap-3 border-b bg-card/80 px-5 py-3 backdrop-blur">
          {item.logo ? (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-card shadow-xs">
              {item.logo}
            </span>
          ) : (
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                toneMap[item.tone ?? "amber"]
              )}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold leading-tight">
              {item.title}
            </p>
            <p className="truncate text-xs text-muted-foreground">{item.time}</p>
          </div>
        </header>

        {/* messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-5">
            {thread.map((m, i) => {
              const pending =
                m.role === "assistant" &&
                m.content === "" &&
                streaming &&
                i === thread.length - 1;
              return <MessageRow key={m.id} message={m} name={name} pending={pending} />;
            })}

            {/* suggested actions under the opener */}
            {thread.length === 1 && !streaming && (
              <div className="ml-11 flex flex-wrap gap-2">
                {item.chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => send(c)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground shadow-xs transition-colors hover:border-primary hover:bg-amber-50 hover:text-amber-800"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* composer */}
        <div className="border-t bg-card/80 backdrop-blur">
          <div className="mx-auto w-full max-w-2xl px-4 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={streaming}
                placeholder={`Talk to Mateos about “${item.title}”…`}
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
          </div>
        </div>
      </section>
    </div>
  );
}

function MessageRow({
  message,
  name,
  pending,
}: {
  message: Msg;
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
