import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";

import {
  ApolloLogo,
  AttioLogo,
  CalendlyLogo,
  DiscordLogo,
  FirefliesLogo,
  GmailLogo,
  GoogleCalendarLogo,
  GrainLogo,
  HubSpotLogo,
  HunterLogo,
  LinkedinLogo,
  LushaLogo,
  NotionLogo,
  OutlookLogo,
  PipedriveLogo,
  SalesforceLogo,
  SlackLogo,
  TeamsLogo,
  TelegramLogo,
  WhatsappLogo,
  ZoomLogo,
} from "@/components/brand/integration-logos";
import { Button } from "@/components/ui/button";

type Category =
  | "CRM"
  | "Messaging"
  | "Prospecting"
  | "Email & Calendar"
  | "Meetings & Scheduling";

const CATEGORY_ORDER: Category[] = [
  "CRM",
  "Messaging",
  "Prospecting",
  "Email & Calendar",
  "Meetings & Scheduling",
];

type Integration = {
  id: string;
  name: string;
  desc: string;
  category: Category;
  node: ReactNode;
};

const INTEGRATIONS: Integration[] = [
  // CRM
  { id: "hubspot", name: "HubSpot", desc: "CRM - deals, contacts and companies.", category: "CRM", node: <HubSpotLogo className="h-7 w-7" /> },
  { id: "salesforce", name: "Salesforce", desc: "Enterprise CRM.", category: "CRM", node: <SalesforceLogo className="h-7 w-7" /> },
  { id: "pipedrive", name: "Pipedrive", desc: "Pipeline-first CRM for SMBs.", category: "CRM", node: <PipedriveLogo className="h-7 w-7" /> },
  { id: "attio", name: "Attio", desc: "Flexible, modern CRM.", category: "CRM", node: <AttioLogo className="h-7 w-7" /> },
  { id: "notion", name: "Notion", desc: "Lightweight CRM in your docs.", category: "CRM", node: <NotionLogo className="h-7 w-7" /> },

  // Messaging
  { id: "slack", name: "Slack", desc: "Notifications and quick approvals.", category: "Messaging", node: <SlackLogo className="h-7 w-7" /> },
  { id: "teams", name: "Microsoft Teams", desc: "Chat & calls for Microsoft shops.", category: "Messaging", node: <TeamsLogo className="h-7 w-7" /> },
  { id: "whatsapp", name: "WhatsApp", desc: "Where a lot of SMB selling happens.", category: "Messaging", node: <WhatsappLogo className="h-7 w-7" /> },
  { id: "telegram", name: "Telegram", desc: "Fast, casual buyer conversations.", category: "Messaging", node: <TelegramLogo className="h-7 w-7" /> },
  { id: "discord", name: "Discord", desc: "Community-led & creator sales.", category: "Messaging", node: <DiscordLogo className="h-7 w-7" /> },

  // Prospecting
  { id: "apollo", name: "Apollo", desc: "Lead search, enrichment and emails.", category: "Prospecting", node: <ApolloLogo className="h-7 w-7" /> },
  { id: "lusha", name: "Lusha", desc: "Contact data and direct dials.", category: "Prospecting", node: <LushaLogo className="h-7 w-7" /> },
  { id: "hunter", name: "Hunter", desc: "Find and verify email addresses.", category: "Prospecting", node: <HunterLogo className="h-7 w-7" /> },
  { id: "linkedin", name: "LinkedIn", desc: "Prospect research and signals.", category: "Prospecting", node: <LinkedinLogo className="h-7 w-7" /> },

  // Email & Calendar
  { id: "gmail", name: "Gmail", desc: "Read threads and draft replies.", category: "Email & Calendar", node: <GmailLogo className="h-7 w-7" /> },
  { id: "calendar", name: "Google Calendar", desc: "Meetings, attendees and scheduling.", category: "Email & Calendar", node: <GoogleCalendarLogo className="h-7 w-7" /> },
  { id: "outlook", name: "Outlook", desc: "Email & calendar for Microsoft teams.", category: "Email & Calendar", node: <OutlookLogo className="h-7 w-7" /> },

  // Meetings & Scheduling
  { id: "zoom", name: "Zoom", desc: "Join links and meeting context.", category: "Meetings & Scheduling", node: <ZoomLogo className="h-7 w-7" /> },
  { id: "calendly", name: "Calendly", desc: "Scheduling links and bookings.", category: "Meetings & Scheduling", node: <CalendlyLogo className="h-7 w-7" /> },
  { id: "fireflies", name: "Fireflies", desc: "Call recordings, notes and actions.", category: "Meetings & Scheduling", node: <FirefliesLogo className="h-7 w-7" /> },
  { id: "grain", name: "Grain", desc: "Meeting recordings, clips and notes.", category: "Meetings & Scheduling", node: <GrainLogo className="h-7 w-7" /> },
];

export default function Integrations() {
  const [connected, setConnected] = useState<Set<string>>(
    new Set(["hubspot", "gmail", "calendar"])
  );

  const toggle = (id: string) =>
    setConnected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const connectedList = INTEGRATIONS.filter((i) => connected.has(i.id));
  const availableByCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: INTEGRATIONS.filter((i) => i.category === cat && !connected.has(i.id)),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-7">
      <header>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your tools so Mateos can read your context and act on your own surfaces.
        </p>
      </header>

      <Section title={`Connected · ${connectedList.length}`}>
        {connectedList.map((i) => (
          <IntegrationCard key={i.id} integration={i} connected onToggle={() => toggle(i.id)} />
        ))}
      </Section>

      {availableByCategory.map((g) => (
        <Section key={g.category} title={g.category}>
          {g.items.map((i) => (
            <IntegrationCard key={i.id} integration={i} connected={false} onToggle={() => toggle(i.id)} />
          ))}
        </Section>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
        {title}
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function IntegrationCard({
  integration,
  connected,
  onToggle,
}: {
  integration: Integration;
  connected: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-xs">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-card">
        {integration.node}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold">{integration.name}</p>
          {connected && (
            <span className="flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-800">
              <Check className="h-2.5 w-2.5" />
              Connected
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{integration.desc}</p>
      </div>
      <Button size="sm" variant="outline" className="shrink-0" onClick={onToggle}>
        {connected ? "Disconnect" : "Connect"}
      </Button>
    </div>
  );
}
