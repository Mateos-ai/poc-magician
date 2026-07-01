import { Navigate, Route, Routes } from "react-router-dom";
import { Target, TrendingUp, Trophy } from "lucide-react";

import AppShell from "@/components/app/app-shell";
import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";
import Chat from "@/pages/Chat";
import Inbox from "@/pages/Inbox";
import InProgress from "@/pages/InProgress";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import PrepareDay from "@/pages/PrepareDay";
import Insights from "@/pages/Insights";
import Assumptions from "@/pages/Assumptions";
import IdealCustomers from "@/pages/IdealCustomers";
import Company from "@/pages/Company";
import Clients from "@/pages/Clients";
import Settings from "@/pages/Settings";
import Workflows from "@/pages/Workflows";
import Integrations from "@/pages/Integrations";
import ComingSoon from "@/pages/ComingSoon";
import { InsightsProvider } from "@/lib/insights-store";

export default function App() {
  return (
    <InsightsProvider>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* App shell - persistent sidebar + topbar */}
      <Route element={<AppShell />}>
        {/* Workspace */}
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/in-progress" element={<InProgress />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/prepare-day" element={<PrepareDay />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />

        {/* Superpowers */}
        <Route
          path="/top-funnel"
          element={
            <ComingSoon
              icon={Target}
              title="Top Your Funnel"
              description="The hero superpower (Lead Gen) - ICP → discover → enrich → score → draft, as a reviewable lead list with a 'why' on every lead."
            />
          }
        />
        <Route
          path="/opportunities"
          element={
            <ComingSoon
              icon={TrendingUp}
              title="Find Opportunities"
              description="Upsell & expansion - Mateos scans your existing customers for the next best move and drafts the outreach."
            />
          }
        />
        <Route
          path="/events"
          element={
            <ComingSoon
              icon={Trophy}
              title="Win The Event"
              description="Conference prep - who to meet, why they matter, and a tailored opener for each, before you walk in the room."
            />
          }
        />

        {/* Learning */}
        <Route path="/insights" element={<Insights />} />
        <Route path="/assumptions" element={<Assumptions />} />
        <Route path="/ideal-customers" element={<IdealCustomers />} />
        <Route path="/company" element={<Company />} />
        <Route path="/clients" element={<Clients />} />

        {/* Configuration */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/integrations" element={<Integrations />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </InsightsProvider>
  );
}
