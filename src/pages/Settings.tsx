import { useState } from "react";
import {
  Building2,
  CreditCard,
  type LucideIcon,
  Palette,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getProfile, saveProfile } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

type Tab = "general" | "members" | "billing" | "appearance";
const TABS: { key: Tab; label: string; icon: LucideIcon }[] = [
  { key: "general", label: "General", icon: Building2 },
  { key: "members", label: "Members", icon: Users },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "appearance", label: "Appearance", icon: Palette },
];

const MEMBERS = [
  { name: "Alex Carmel", role: "Owner", you: true },
  { name: "Dana Roth", role: "Admin", you: false },
  { name: "Sam Okoro", role: "Member", you: false },
  { name: "Priya Nair", role: "Member", you: false },
];
const initials = (n: string) => n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const roleStyle: Record<string, string> = {
  Owner: "border-amber-200 bg-amber-50 text-amber-800",
  Admin: "border-indigo-200 bg-indigo-50 text-indigo-700",
  Member: "border-border bg-muted text-muted-foreground",
};

export default function Settings() {
  const [tab, setTab] = useState<Tab>("general");

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-7">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your workspace, team and preferences.
      </p>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row">
        {/* tab rail */}
        <nav className="flex gap-1 overflow-x-auto sm:w-44 sm:shrink-0 sm:flex-col">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors",
                tab === t.key
                  ? "bg-amber-50 text-amber-800"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <t.icon className="h-4 w-4 shrink-0" />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          {tab === "general" && <GeneralPanel />}
          {tab === "members" && <MembersPanel />}
          {tab === "billing" && <BillingPanel />}
          {tab === "appearance" && <AppearancePanel />}
        </div>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-xl border bg-card p-5 shadow-xs">{children}</section>;
}

function GeneralPanel() {
  const [name, setName] = useState(getProfile().workspace);
  const [saved, setSaved] = useState(true);
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h2 className="font-display text-sm font-bold">Workspace</h2>
        <div className="mt-3 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Workspace name</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
          />
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Workspace URL</label>
          <input
            disabled
            value="acme.mateos.ai"
            className="h-10 rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            variant={saved ? "outline" : "default"}
            disabled={saved}
            onClick={() => {
              saveProfile({ name: getProfile().name, workspace: name.trim() || getProfile().workspace });
              setSaved(true);
            }}
          >
            {saved ? "Saved" : "Save changes"}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-sm font-bold text-destructive">Danger zone</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Deleting the workspace removes all chats, projects and data. This can't be undone.
        </p>
        <Button variant="outline" className="mt-3 border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive">
          Delete workspace
        </Button>
      </Card>
    </div>
  );
}

function MembersPanel() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm font-bold">Members</h2>
          <p className="text-xs text-muted-foreground">
            You're an admin — you can invite and manage the team.
          </p>
        </div>
        <Button size="sm">
          <UserPlus className="h-4 w-4" />
          Invite
        </Button>
      </div>

      <div className="mt-4 flex flex-col divide-y">
        {MEMBERS.map((m) => (
          <div key={m.name} className="flex items-center gap-3 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
              {initials(m.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                {m.name}
                {m.you && <span className="ml-1.5 text-xs font-normal text-muted-foreground">(you)</span>}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {m.name.split(" ")[0].toLowerCase()}@acme.com
              </p>
            </div>
            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", roleStyle[m.role])}>
              {m.role}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function BillingPanel() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-sm font-bold">Free trial</h2>
            <p className="mt-1 text-xs text-muted-foreground">13 days left · then $49 / seat / month</p>
          </div>
          <Button>Upgrade to Pro</Button>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[55%] rounded-full bg-gradient-brand" />
        </div>
      </Card>
      <Card>
        <h2 className="font-display text-sm font-bold">Payment method</h2>
        <div className="mt-3 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            No card on file
          </p>
          <Button variant="outline" size="sm">Add card</Button>
        </div>
      </Card>
    </div>
  );
}

const THEMES = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "system", label: "System" },
];

function AppearancePanel() {
  const [theme, setTheme] = useState("light");
  return (
    <Card>
      <h2 className="font-display text-sm font-bold">Theme</h2>
      <p className="text-xs text-muted-foreground">Pick how Mateos looks for you.</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {THEMES.map((t) => (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            className={cn(
              "rounded-lg border p-3 text-left transition-colors",
              theme === t.key ? "border-primary bg-amber-50/50" : "border-border hover:bg-muted/50"
            )}
          >
            <div
              className={cn(
                "h-12 w-full rounded-md border",
                t.key === "dark" ? "bg-[#14141e]" : t.key === "system" ? "bg-gradient-to-r from-white to-[#14141e]" : "bg-white"
              )}
            />
            <p className="mt-2 text-sm font-semibold">{t.label}</p>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">Demo · only Light is wired up.</p>
    </Card>
  );
}
