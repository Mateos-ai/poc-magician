import { type ReactNode } from "react";
import { Clock } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import {
  GmailLogo,
  GoogleCalendarLogo,
  HubSpotLogo,
} from "@/components/brand/integration-logos";
import { cn } from "@/lib/utils";

type Stage = "Closed won" | "Negotiation" | "Discovery";
const stageStyle: Record<Stage, string> = {
  "Closed won": "border-teal-200 bg-teal-50 text-teal-800",
  Negotiation: "border-amber-200 bg-amber-50 text-amber-800",
  Discovery: "border-indigo-200 bg-indigo-50 text-indigo-700",
};

type Source = { node: ReactNode; label: string };
const SRC = {
  hubspot: { node: <HubSpotLogo className="h-3.5 w-3.5" />, label: "HubSpot" },
  gmail: { node: <GmailLogo className="h-3.5 w-3.5" />, label: "Gmail" },
  calendar: { node: <GoogleCalendarLogo className="h-3.5 w-3.5" />, label: "Calendar" },
  mateos: { node: <Logo className="h-3.5 w-3.5" />, label: "Mateos chats" },
} satisfies Record<string, Source>;

type Client = {
  id: string;
  company: string;
  contact: string;
  stage: Stage;
  value: string;
  last: string;
  gathered: string;
  sources: (keyof typeof SRC)[];
};

const CLIENTS: Client[] = [
  {
    id: "harlow",
    company: "Harlow & Co.",
    contact: "Dana Levin · Head of Talent",
    stage: "Negotiation",
    value: "$32k",
    last: "Replied 2h ago",
    gathered: "12 emails · 2 calls · 1 Mateos chat",
    sources: ["hubspot", "gmail", "mateos"],
  },
  {
    id: "meridian",
    company: "Meridian Talent",
    contact: "Jordan Pike · VP People",
    stage: "Discovery",
    value: "$18k",
    last: "Intro call today, 1:30 PM",
    gathered: "4 emails · 1 meeting booked",
    sources: ["hubspot", "gmail", "calendar"],
  },
  {
    id: "cobalt",
    company: "Cobalt Systems",
    contact: "Sam Okoro · COO",
    stage: "Closed won",
    value: "$24k",
    last: "Note added yesterday",
    gathered: "20 emails · 3 calls · 2 Mateos chats",
    sources: ["hubspot", "gmail", "mateos"],
  },
];

export default function Clients() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-7">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Our Clients
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pulled from your CRM and enriched with everything Mateos sees across
            email, calendar and chat.
          </p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
          <HubSpotLogo className="h-4 w-4" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
          Connected · synced 5 min ago
        </span>
      </header>

      <div className="mt-6 flex flex-col gap-2.5">
        {CLIENTS.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-xs transition-shadow hover:shadow-sm"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-sm font-bold text-white">
              {c.company.charAt(0)}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold">{c.company}</p>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    stageStyle[c.stage]
                  )}
                >
                  {c.stage}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.contact}</p>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {c.last}
                </span>
                <span className="text-[11px] text-muted-foreground/70">
                  {c.gathered}
                </span>
              </div>
            </div>

            <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
              <p className="font-display text-base font-extrabold tracking-tight">
                {c.value}
              </p>
              <div className="flex items-center gap-1">
                {c.sources.map((s) => (
                  <span
                    key={s}
                    title={SRC[s].label}
                    className="flex h-6 w-6 items-center justify-center rounded-md border bg-card"
                  >
                    {SRC[s].node}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Demo · Mateos keeps each record fresh as new emails, meetings and chats
        come in.
      </p>
    </div>
  );
}
