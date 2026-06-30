import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BarChart3,
  Building2,
  Crosshair,
  FolderKanban,
  Lightbulb,
  LoaderCircle,
  type LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
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
    title: "Chat",
    items: [
      { to: "/chat", label: "Ask Mateos", icon: Sparkles },
      { to: "/projects", label: "Projects", icon: FolderKanban },
    ],
  },
  {
    title: "Work",
    items: [
      { to: "/inbox", label: "Take Action", icon: Zap, badge: "4" },
      { to: "/in-progress", label: "In Progress", icon: LoaderCircle },
      { to: "/prepare-day", label: "Prepare My Day", icon: Sun },
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
      { to: "/assumptions", label: "Assumptions", icon: Lightbulb },
    ],
  },
  {
    title: "Workspace",
    items: [
      { to: "/ideal-customers", label: "Ideal Customers", icon: Crosshair },
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

const ALL_NAV = NAV_GROUPS.flatMap((g) => g.items);

function NavRow({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center rounded-md text-[13px] font-semibold transition-colors",
          collapsed ? "h-9 w-9 justify-center" : "gap-2.5 px-2.5 py-1.5",
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
              "shrink-0",
              collapsed ? "h-4 w-4" : "h-3.5 w-3.5",
              isActive ? "text-amber-700" : "text-muted-foreground"
            )}
          />
          {!collapsed && <span className="flex-1">{item.label}</span>}
          {!collapsed && item.badge && (
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
          {collapsed && item.badge && (
            <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r bg-card transition-[width] duration-200 lg:flex",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* workspace + collapse toggle */}
        <div
          className={cn(
            "flex h-14 items-center border-b",
            collapsed ? "justify-center px-0" : "gap-2.5 px-4"
          )}
        >
          {!collapsed && (
            <>
              <img
                src={import.meta.env.BASE_URL + "acme.webp"}
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
            </>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav
          className={cn(
            "flex flex-1 flex-col overflow-y-auto",
            collapsed ? "items-center gap-1 p-2" : "gap-2.5 p-2.5"
          )}
        >
          {NAV_GROUPS.map((group, gi) => (
            <div
              key={group.title}
              className={cn(
                "flex w-full flex-col",
                collapsed ? "items-center gap-1" : "gap-0.5"
              )}
            >
              {collapsed
                ? gi > 0 && <span className="my-1 h-px w-6 bg-border" />
                : (
                  <span className="px-2.5 pb-1.5 pt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/55">
                    {group.title}
                  </span>
                )}
              {group.items.map((item) => (
                <NavRow key={item.to} item={item} collapsed={collapsed} />
              ))}
            </div>
          ))}
        </nav>

        {/* user */}
        <button
          className={cn(
            "flex items-center border-t transition-colors hover:bg-muted/60",
            collapsed ? "justify-center py-3" : "gap-2.5 px-4 py-3 text-left"
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
            {initials}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight">{name}</p>
              <p className="truncate text-xs text-muted-foreground">
                Free trial · 13 days left
              </p>
            </div>
          )}
        </button>
      </aside>

      {/* ── Main column ─────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card/80 px-5 backdrop-blur">
          {/* compact brand for small screens */}
          <Link to="/chat" className="flex items-center gap-2 lg:hidden">
            <Logo className="h-6 w-6" />
            <span className="font-display text-sm font-extrabold">Mateos</span>
          </Link>
          <h1 className="hidden font-display text-base font-bold tracking-tight lg:block">
            {ALL_NAV.find((n) => pathname.startsWith(n.to))?.label ?? ""}
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
