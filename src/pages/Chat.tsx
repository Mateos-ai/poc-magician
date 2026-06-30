import { useRef, useState } from "react";
import {
  ArrowUp,
  CalendarClock,
  Compass,
  type LucideIcon,
  Target,
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

export default function Chat() {
  const { name, workspace } = getProfile();
  const firstName = name.split(" ")[0];
  const system = mateosSystem(name, workspace);

  const greeting: ChatMessage = {
    id: 0,
    role: "assistant",
    content: `Hi ${firstName} 👋  I'm Mateos, your sales co-pilot. What should we work on? Here are a few things I can help with right now:`,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [started, setStarted] = useState(false);

  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    requestAnimationFrame(() =>
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    );

  // Recommendation buttons → animated tool trace, then a structured card.
  function submitCard(label: string, kind: CardKind) {
    if (streaming) return;
    const userMsg: ChatMessage = { id: idRef.current++, role: "user", content: label };
    const assistantMsg: ChatMessage = {
      id: idRef.current++,
      role: "assistant",
      content: "",
      thinking: kind,
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStarted(true);
    setStreaming(true);
    scrollToBottom();
  }

  // Called when the tool trace finishes — reveal the card.
  function revealCard(id: number, kind: CardKind) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, content: CARD_INTRO[kind](firstName), card: kind }
          : m
      )
    );
    setStreaming(false);
    scrollToBottom();
  }

  // Free-typed messages → live Claude stream.
  async function submit(value: string) {
    const text = value.trim();
    if (!text || streaming) return;

    const userMsg: ChatMessage = { id: idRef.current++, role: "user", content: text };
    const assistantMsg: ChatMessage = {
      id: idRef.current++,
      role: "assistant",
      content: "",
    };
    const convo = [...messages, userMsg];

    setMessages([...convo, assistantMsg]);
    setInput("");
    setStarted(true);
    setStreaming(true);
    scrollToBottom();

    // Drop the canned greeting (the API requires the first turn to be the user);
    // skip card-only messages, which carry no useful text for the model.
    const apiMessages: MateosMessage[] = convo
      .filter((m, i) => !(i === 0 && m.role === "assistant"))
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      await streamMateos(apiMessages, system, (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, content: m.content + chunk } : m
          )
        );
        scrollToBottom();
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong talking to Mateos.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id ? { ...m, content: `⚠️ ${message}` } : m
        )
      );
    } finally {
      setStreaming(false);
      scrollToBottom();
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* messages */}
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

            // Card actions: animated tool trace that settles into all-checks,
            // with the structured card revealed underneath it.
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
                        onDone={() => revealCard(m.id, m.thinking!)}
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

                {/* recommendation buttons under the opening message */}
                {m.id === 0 && !started && (
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
