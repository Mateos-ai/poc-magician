import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BarChart3,
  Building2,
  ChevronsUpDown,
  FolderKanban,
  type LucideIcon,
  Plug,
  Settings,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { getProfile } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

type NavGroup = { title: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Workspace",
    items: [
      { to: "/inbox", label: "Take Action", icon: Zap, badge: "4" },
      { to: "/chat", label: "Ask Mateos", icon: Sparkles },
      { to: "/prepare-day", label: "Prepare My Day", icon: Sun },
      { to: "/projects", label: "Projects", icon: FolderKanban },
    ],
  },
  {
    title: "Superpowers",
    items: [
      { to: "/top-funnel", label: "Top Your Funnel", icon: Target },
      { to: "/opportunities", label: "Find Opportunities", icon: TrendingUp },
      { to: "/events", label: "Win The Event", icon: Trophy },
    ],
  },
  {
    title: "Learning",
    items: [
      { to: "/insights", label: "Insights", icon: BarChart3 },
      { to: "/company", label: "Our Company", icon: Building2 },
      { to: "/clients", label: "Our Clients", icon: Users },
    ],
  },
  {
    title: "Configuration",
    items: [
      { to: "/settings", label: "Settings", icon: Settings },
      { to: "/workflows", label: "Workflows", icon: Workflow },
      { to: "/integrations", label: "Integrations", icon: Plug },
    ],
  },
];

const ALL_NAV = [
  { to: "/dashboard", label: "Home" },
  ...NAV_GROUPS.flatMap((g) => g.items),
];

function NavRow({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
          isActive
            ? "bg-amber-50 text-amber-800"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            className={cn(
              "h-4 w-4 shrink-0",
              isActive ? "text-amber-700" : "text-muted-foreground"
            )}
          />
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                item.badge === "Hero"
                  ? "bg-teal-100 text-teal-800"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function AppShell() {
  const { workspace, name } = getProfile();
  const { pathname } = useLocation();
  const initials = name.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card lg:flex">
        {/* workspace switcher → Home */}
        <Link
          to="/dashboard"
          className="flex h-14 items-center gap-2.5 border-b px-4 transition-colors hover:bg-muted/60"
        >
          <img
            src="/acme.webp"
            alt={workspace}
            className="h-9 w-9 shrink-0 rounded-lg object-cover shadow-xs"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-bold leading-tight">
              {workspace}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              Mateos workspace
            </p>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </Link>

        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col gap-1">
              <span className="px-3 pb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/55">
                {group.title}
              </span>
              {group.items.map((item) => (
                <NavRow key={item.to} item={item} />
              ))}
            </div>
          ))}
        </nav>

        {/* user */}
        <button className="flex items-center gap-2.5 border-t px-4 py-3 text-left transition-colors hover:bg-muted/60">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight">{name}</p>
            <p className="truncate text-xs text-muted-foreground">
              Free trial · 13 days left
            </p>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </aside>

      {/* ── Main column ─────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card/80 px-5 backdrop-blur">
          {/* compact brand for small screens */}
          <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
            <Logo className="h-6 w-6" />
            <span className="font-display text-sm font-extrabold">Mateos</span>
          </Link>
          <h1 className="hidden font-display text-base font-bold tracking-tight lg:block">
            {ALL_NAV.find((n) => pathname.startsWith(n.to))?.label ?? "Home"}
          </h1>
          <span className="ml-auto rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
            Demo
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
