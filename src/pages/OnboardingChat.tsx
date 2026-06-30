import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  Building2,
  Globe,
  MapPin,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
   Demo-only scripted onboarding chat. Nothing is fetched or
   stored — Mateos "thinks" with timeouts and canned cards.
   ──────────────────────────────────────────────────────────── */

type Question = {
  key: "company" | "website" | "sellTo" | "where" | "whatSell";
  prompt: string;
  placeholder: string;
  suggestions?: string[];
  lookup?: boolean;
};

// After this many answers, Mateos decides it has enough to start.
const READY_AT = 4;

const QUESTIONS: Question[] = [
  {
    key: "company",
    prompt: "First — what's your company called?",
    placeholder: "Company name",
    suggestions: ["Acme Inc."],
  },
  {
    key: "website",
    prompt:
      "Thanks. What's your website? I'll take a quick look so you don't have to type everything out.",
    placeholder: "company.com",
    suggestions: ["acme.com"],
    lookup: true,
  },
  {
    key: "sellTo",
    prompt:
      "Who do you sell to? Your best-fit customers — think industry, company size and the roles you usually talk to.",
    placeholder: "e.g. HR & talent leaders at 50–500-person firms",
    suggestions: [
      "HR & talent leaders at 50–500-person firms",
      "Heads of Sales at B2B SaaS companies",
    ],
  },
  {
    key: "where",
    prompt: "And where are they? The regions or markets you focus on.",
    placeholder: "e.g. UK & Western Europe",
    suggestions: ["UK & Western Europe", "United States", "DACH region"],
  },
  {
    key: "whatSell",
    prompt:
      "Last one for now — what do you sell? A sentence on your main offer is plenty. (Optional — you can hit Ready to start anytime.)",
    placeholder: "e.g. Executive search & recruiting",
    suggestions: ["Executive search & recruiting", "A B2B SaaS platform"],
  },
];

type Card = "lookup" | "icp";
type Message = {
  id: number;
  role: "mateos" | "user";
  text?: string;
  card?: Card;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function OnboardingChat({
  name,
  workspace,
}: {
  name: string;
  workspace: string;
}) {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [awaiting, setAwaiting] = useState(false);
  const [ready, setReady] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const idRef = useRef(0);
  const readyRef = useRef(false);
  const startedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const nextId = () => (idRef.current += 1);

  const say = async (text: string, delay = 850, card?: Card) => {
    setTyping(true);
    await wait(delay);
    setTyping(false);
    setMessages((m) => [...m, { id: nextId(), role: "mateos", text, card }]);
  };

  const ask = async (index: number) => {
    await say(QUESTIONS[index].prompt, 700);
    setQIndex(index);
    setAwaiting(true);
  };

  // Intro — runs once.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    (async () => {
      await say(`Hi ${name} 👋  I'm Mateos.`, 500);
      await say(
        `To set up ${workspace}, I'll ask a few quick questions about your business. It shapes the leads I find and the outreach I draft — and you can skip whenever you like.`,
        1100
      );
      await ask(0);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the latest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const submit = async (raw: string) => {
    const value = raw.trim();
    if (!value || !awaiting || typing) return;

    const q = QUESTIONS[qIndex];
    setMessages((m) => [...m, { id: nextId(), role: "user", text: value }]);
    setAnswers((a) => ({ ...a, [q.key]: value }));
    setInput("");
    setAwaiting(false);

    const answeredCount = qIndex + 1;

    if (q.lookup) {
      const site = value.replace(/^https?:\/\//, "").replace(/\/+$/, "");
      await say(`Looking up ${site}…`, 450);
      await wait(1300);
      setMessages((m) => [...m, { id: nextId(), role: "mateos", card: "lookup" }]);
      await say(
        "Here's what I pulled together from your site — I'll keep sharpening it as we talk.",
        500
      );
    }

    // Mateos realizes it has enough to begin.
    if (answeredCount >= READY_AT && !readyRef.current) {
      readyRef.current = true;
      setReady(true);
      await say(
        "That's enough for me to get going — here's the first ICP I'd target. Press “Ready to start” whenever you like, or keep going to sharpen it.",
        900
      );
      setMessages((m) => [...m, { id: nextId(), role: "mateos", card: "icp" }]);
    }

    const next = qIndex + 1;
    if (next < QUESTIONS.length) {
      await ask(next);
    } else {
      await say(
        "Perfect — your profile's looking solid. Whenever you're ready, let's get to work.",
        800
      );
      if (!readyRef.current) {
        readyRef.current = true;
        setReady(true);
      }
    }
  };

  const current = QUESTIONS[qIndex];
  const completion = ready
    ? 100
    : Math.min(100, Math.round((Object.keys(answers).length / READY_AT) * 100));

  return (
    <main className="flex h-screen flex-col bg-muted/40">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border bg-card shadow-xs">
            <Logo className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-bold leading-tight">
              Set up {workspace}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-brand transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                Profile {completion}%
              </span>
            </div>
          </div>

          {ready ? (
            <Button size="sm" onClick={() => navigate("/chat")}>
              Ready to start
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSkip(true)}
              className="text-muted-foreground"
            >
              Skip for now
            </Button>
          )}
        </div>
      </header>

      {/* ── Messages ────────────────────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6">
          {messages.map((m) => (
            <MessageRow key={m.id} message={m} name={name} answers={answers} />
          ))}
          {typing && <TypingRow />}
        </div>
      </div>

      {/* ── Composer ────────────────────────────────────────── */}
      <div className="border-t bg-card/80 backdrop-blur">
        <div className="mx-auto w-full max-w-2xl px-4 py-3">
          {awaiting && current?.suggestions && (
            <div className="mb-2.5 flex flex-wrap gap-2">
              {current.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-amber-50 hover:text-amber-700"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

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
              disabled={!awaiting || typing}
              placeholder={
                awaiting ? current?.placeholder : "Mateos is typing…"
              }
              className="h-11 flex-1 rounded-xl border border-input bg-background px-4 text-sm transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100 disabled:opacity-60"
            />
            <Button
              type="submit"
              size="icon"
              className="h-11 w-11 rounded-xl"
              disabled={!awaiting || typing || !input.trim()}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Demo · Mateos can't actually browse your site here
          </p>
        </div>
      </div>

      {showSkip && (
        <SkipDialog
          onClose={() => setShowSkip(false)}
          onSkip={() => navigate("/chat")}
        />
      )}
    </main>
  );
}

/* ── Message row ───────────────────────────────────────────── */
function MessageRow({
  message,
  name,
  answers,
}: {
  message: Message;
  name: string;
  answers: Record<string, string>;
}) {
  const isMateos = message.role === "mateos";
  return (
    <div className={cn("flex gap-2.5", isMateos ? "justify-start" : "justify-end")}>
      {isMateos && (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-card shadow-xs">
          <Logo className="h-4 w-4" />
        </span>
      )}

      <div className={cn("flex max-w-[82%] flex-col gap-2", !isMateos && "items-end")}>
        {message.text && (
          <div
            className={cn(
              "whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
              isMateos
                ? "rounded-tl-sm bg-card text-card-foreground shadow-sm"
                : "rounded-tr-sm bg-secondary text-secondary-foreground"
            )}
          >
            {message.text}
          </div>
        )}
        {message.card === "lookup" && <LookupCard answers={answers} />}
        {message.card === "icp" && <IcpCard answers={answers} />}
      </div>

      {!isMateos && (
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-secondary-foreground">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function TypingRow() {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-card shadow-xs">
        <Logo className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-card px-4 py-3 shadow-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Auto-detected company card ────────────────────────────── */
function LookupCard({ answers }: { answers: Record<string, string> }) {
  const company = answers.company || "Your company";
  const website = (answers.website || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");

  const facts = [
    { icon: Building2, label: "Industry", value: "Professional services" },
    { icon: Users, label: "Employees", value: "11–50" },
    { icon: MapPin, label: "Headquarters", value: "—" },
    { icon: Globe, label: "Founded", value: "—" },
  ];

  return (
    <div className="w-full rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand text-sm font-bold text-white">
          {company.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold">{company}</p>
          {website && (
            <p className="truncate font-mono text-xs text-muted-foreground">
              {website}
            </p>
          )}
        </div>
        <span className="ml-auto rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-800">
          Auto-detected
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {facts.map((f) => (
          <div key={f.label} className="flex items-center gap-2">
            <f.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {f.label}
              </p>
              <p className="truncate text-xs font-semibold">{f.value}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 border-t pt-2.5 text-[11px] text-muted-foreground">
        Pulled from your website — you can confirm or edit any of this later.
      </p>
    </div>
  );
}

/* ── First ICP draft card ──────────────────────────────────── */
function IcpCard({ answers }: { answers: Record<string, string> }) {
  const rows = [
    { icon: Target, label: "Target customers", value: answers.sellTo },
    { icon: MapPin, label: "Markets", value: answers.where },
    { icon: Sparkles, label: "What you sell", value: answers.whatSell },
  ].filter((r) => r.value);

  return (
    <div className="w-full rounded-xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-amber-700" />
        <p className="font-display text-sm font-bold text-amber-900">
          First ICP
        </p>
        <span className="rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
          Draft
        </span>
      </div>

      <dl className="mt-3 space-y-2.5">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-2.5">
            <r.icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-700/80" />
            <div>
              <dt className="text-[10px] uppercase tracking-wide text-amber-800/70">
                {r.label}
              </dt>
              <dd className="text-sm font-medium text-amber-950">{r.value}</dd>
            </div>
          </div>
        ))}
      </dl>

      <p className="mt-3 border-t border-amber-200 pt-2.5 text-[11px] text-amber-800/80">
        Mateos will use this to find and rank your first batch of leads.
      </p>
    </div>
  );
}

/* ── Skip popup ────────────────────────────────────────────── */
function SkipDialog({
  onClose,
  onSkip,
}: {
  onClose: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-lg border bg-card p-6 shadow-xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100">
          <Sparkles className="h-5 w-5 text-amber-700" />
        </div>
        <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
          Skip setup for now?
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Mateos works best when it knows your business — it's how it finds the
          right leads and drafts outreach that sounds like you. You can start
          now and finish your profile from Settings anytime.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={onClose}>Keep setting up</Button>
          <Button variant="ghost" onClick={onSkip}>
            Skip and start with the basics
          </Button>
        </div>
      </div>
    </div>
  );
}
