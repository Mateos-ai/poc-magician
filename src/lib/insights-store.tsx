import { createContext, useContext, useState, type ReactNode } from "react";

export type Assumption = {
  id: string;
  group: string;
  text: string;
  source: string;
};

export type InsightSource = "rejections" | "conversations" | "research";

export type Insight = {
  id: string;
  source: InsightSource;
  title: string;
  detail: string;
  assumption: { group: string; text: string };
};

export const SOURCE_LABEL: Record<InsightSource, string> = {
  rejections: "From rejections",
  conversations: "From conversations",
  research: "From research",
};

export const GROUP_ORDER = [
  "Ideal Customer",
  "Buyer",
  "Channels",
  "Geography",
  "Messaging",
  "Cadence",
];

const INITIAL_ASSUMPTIONS: Assumption[] = [
  { id: "a1", group: "Ideal Customer", text: "Best-fit company size is 50–200 employees", source: "From closed-won" },
  { id: "a2", group: "Ideal Customer", text: "Recruiting & staffing firms are the strongest industry", source: "From closed-won" },
  { id: "a3", group: "Ideal Customer", text: "Recently funded or fast-hiring is the top buying signal", source: "From conversations" },
  { id: "a4", group: "Buyer", text: "The primary buyer is the Head of Talent or VP People", source: "From conversations" },
  { id: "a5", group: "Buyer", text: "Deals stall without an executive sponsor", source: "From rejections" },
  { id: "a6", group: "Geography", text: "Core market is the UK & Western Europe", source: "You added" },
  { id: "a7", group: "Messaging", text: "Leads who mention “time-to-hire” convert best", source: "From conversations" },
  { id: "a8", group: "Cadence", text: "Reply rates are highest on Tuesday mornings", source: "From conversations" },
  { id: "a9", group: "Cadence", text: "Follow up within 4 days or deals go cold", source: "From rejections" },
];

const SEED_INSIGHTS: Insight[] = [
  {
    id: "i-rejections",
    source: "rejections",
    title: "You keep passing on sub-20-person companies",
    detail:
      "7 of your last 9 rejected leads were under 20 employees — they churn fast and rarely close.",
    assumption: {
      group: "Ideal Customer",
      text: "Companies under 20 employees are too small — deprioritise them",
    },
  },
  {
    id: "i-conversations",
    source: "conversations",
    title: "Warm intros close far more often",
    detail:
      "Referral leads get a reply from you within the hour and close ~3× more often than cold ones.",
    assumption: {
      group: "Channels",
      text: "Prioritise warm intros & referrals — they close about 3× more often",
    },
  },
  {
    id: "i-research",
    source: "research",
    title: "Fintech outreach is underperforming",
    detail:
      "Your fintech experiment is at a 4% reply rate vs 18% for recruiting — likely outside your ICP.",
    assumption: {
      group: "Ideal Customer",
      text: "Fintech is outside the core ICP — deprioritise it",
    },
  },
];

type Ctx = {
  assumptions: Assumption[];
  insights: Insight[];
  confirmInsight: (id: string, text?: string) => void;
  dismissInsight: (id: string) => void;
  runSource: (source: InsightSource) => void;
  addAssumption: (group: string, text: string) => void;
  removeAssumption: (id: string) => void;
};

const InsightsContext = createContext<Ctx | null>(null);

let counter = 1;
const newId = (prefix: string) => `${prefix}-${counter++}`;

export function InsightsProvider({ children }: { children: ReactNode }) {
  const [assumptions, setAssumptions] = useState<Assumption[]>(INITIAL_ASSUMPTIONS);
  const [insights, setInsights] = useState<Insight[]>(SEED_INSIGHTS);

  const confirmInsight = (id: string, text?: string) => {
    const ins = insights.find((i) => i.id === id);
    if (!ins) return;
    setAssumptions((prev) => [
      ...prev,
      {
        id: newId("a"),
        group: ins.assumption.group,
        text: (text ?? ins.assumption.text).trim() || ins.assumption.text,
        source: SOURCE_LABEL[ins.source],
      },
    ]);
    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  const dismissInsight = (id: string) =>
    setInsights((prev) => prev.filter((i) => i.id !== id));

  const runSource = (source: InsightSource) => {
    const seed = SEED_INSIGHTS.find((s) => s.source === source);
    if (!seed) return;
    setInsights((prev) => (prev.some((i) => i.id === seed.id) ? prev : [seed, ...prev]));
  };

  const addAssumption = (group: string, text: string) =>
    setAssumptions((prev) => [
      ...prev,
      { id: newId("a"), group, text: text.trim(), source: "You added" },
    ]);

  const removeAssumption = (id: string) =>
    setAssumptions((prev) => prev.filter((a) => a.id !== id));

  return (
    <InsightsContext.Provider
      value={{
        assumptions,
        insights,
        confirmInsight,
        dismissInsight,
        runSource,
        addAssumption,
        removeAssumption,
      }}
    >
      {children}
    </InsightsContext.Provider>
  );
}

export function useInsights() {
  const ctx = useContext(InsightsContext);
  if (!ctx) throw new Error("useInsights must be used within InsightsProvider");
  return ctx;
}
