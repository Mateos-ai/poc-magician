import { Navigate, Route, Routes } from "react-router-dom";
import {
  BarChart3,
  Building2,
  FolderKanban,
  Plug,
  Settings,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Workflow,
} from "lucide-react";

import AppShell from "@/components/app/app-shell";
import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import Inbox from "@/pages/Inbox";
import PrepareDay from "@/pages/PrepareDay";
import ComingSoon from "@/pages/ComingSoon";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* App shell — persistent sidebar + topbar */}
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Workspace */}
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/prepare-day" element={<PrepareDay />} />
        <Route
          path="/projects"
          element={
            <ComingSoon
              icon={FolderKanban}
              title="Projects"
              description="Ongoing pieces of work Mateos runs for you — each superpower run, organised and trackable in one place."
            />
          }
        />

        {/* Superpowers */}
        <Route
          path="/top-funnel"
          element={
            <ComingSoon
              icon={Target}
              title="Top Your Funnel"
              description="The hero superpower (Lead Gen) — ICP → discover → enrich → score → draft, as a reviewable lead list with a 'why' on every lead."
            />
          }
        />
        <Route
          path="/opportunities"
          element={
            <ComingSoon
              icon={TrendingUp}
              title="Find Opportunities"
              description="Upsell & expansion — Mateos scans your existing customers for the next best move and drafts the outreach."
            />
          }
        />
        <Route
          path="/events"
          element={
            <ComingSoon
              icon={Trophy}
              title="Win The Event"
              description="Conference prep — who to meet, why they matter, and a tailored opener for each, before you walk in the room."
            />
          }
        />

        {/* Learning */}
        <Route
          path="/insights"
          element={
            <ComingSoon
              icon={BarChart3}
              title="Insights"
              description="What's working across your funnel — response rates, best-fit segments, and what Mateos is learning about your sales motion."
            />
          }
        />
        <Route
          path="/company"
          element={
            <ComingSoon
              icon={Building2}
              title="Our Company"
              description="Your company profile and ICP — the context Mateos uses. Finish anything you skipped during onboarding, anytime."
            />
          }
        />
        <Route
          path="/clients"
          element={
            <ComingSoon
              icon={Users}
              title="Our Clients"
              description="Your customers and closed-won deals — the lookalike pattern Mateos learns from to find more of your best leads."
            />
          }
        />

        {/* Configuration */}
        <Route
          path="/settings"
          element={
            <ComingSoon
              icon={Settings}
              title="Settings"
              description="Workspace, team and preferences. Demo only — nothing here is wired up yet."
            />
          }
        />
        <Route
          path="/workflows"
          element={
            <ComingSoon
              icon={Workflow}
              title="Workflows"
              description="Save the multi-step plays Mateos runs for you — lead-gen, day prep, event prep — so they run on a schedule or a trigger, hands-off."
            />
          }
        />
        <Route
          path="/integrations"
          element={
            <ComingSoon
              icon={Plug}
              title="Integrations"
              description="Connect Gmail, Calendar, Monday and Apollo so Mateos can read your context and draft on your surfaces."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
