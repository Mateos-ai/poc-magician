/** Demo project data, shared by the gallery and the detail page. */
export type ProjectChat = {
  id: string;
  title: string;
  updated: string;
  /** How much of the context window this conversation has used. */
  contextPct: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  summary: string;
  instructions: string;
  updated: string;
  tone: "amber" | "teal" | "indigo";
  conversations: ProjectChat[];
};

export const PROJECTS: Project[] = [
  {
    id: "q3",
    name: "Q3 Pipeline",
    description: "Deals, forecasts and where to focus this quarter.",
    summary:
      "The deals that decide your quarter — the forecast, the stalled ones worth reviving, and where your time pays off most.",
    instructions:
      "Focus on deals closing this quarter. Prioritise recruiting firms and anything over $20k. Flag risks early and always propose a concrete next step.",
    updated: "Updated 2h ago",
    tone: "amber",
    conversations: [
      { id: "q3-1", title: "Q3 — where to focus", updated: "2h ago", contextPct: 34 },
      { id: "q3-2", title: "Stalled deals to revive", updated: "Yesterday", contextPct: 58 },
      { id: "q3-3", title: "Forecast for the board", updated: "Mon", contextPct: 81 },
      { id: "q3-4", title: "Which deals to push to Q4", updated: "Last week", contextPct: 12 },
    ],
  },
  {
    id: "icp",
    name: "Recruiting ICP",
    description: "Your best-fit customers and the patterns behind them.",
    summary:
      "Everything about your best-fit customers — the closed-won pattern, the leads that match it, and how to keep the definition sharp.",
    instructions:
      "Score every lead against our closed-won recruiting deals (50–200 staff, recently funded). Be explicit about why each lead fits or doesn't.",
    updated: "Updated yesterday",
    tone: "teal",
    conversations: [
      { id: "icp-1", title: "Leads like Meridian Talent", updated: "3h ago", contextPct: 27 },
      { id: "icp-2", title: "Why these leads?", updated: "Yesterday", contextPct: 45 },
      { id: "icp-3", title: "Refine the ICP from closed-won", updated: "Tue", contextPct: 63 },
    ],
  },
  {
    id: "saastr",
    name: "SaaStr 2026",
    description: "Prep, target accounts and follow-ups for the event.",
    summary:
      "Your game plan for SaaStr 2026 — who to meet, what to say, and the follow-ups that turn hallway chats into pipeline.",
    instructions:
      "Prioritise attendees who match our ICP. Keep openers short and specific to each person. Draft same-day follow-ups.",
    updated: "Updated Mon",
    tone: "indigo",
    conversations: [
      { id: "ss-1", title: "Attendees worth meeting", updated: "Mon", contextPct: 22 },
      { id: "ss-2", title: "Booth talking points", updated: "Mon", contextPct: 9 },
      { id: "ss-3", title: "Post-event follow-ups", updated: "4d ago", contextPct: 51 },
    ],
  },
  {
    id: "expansion",
    name: "Enterprise Expansion",
    description: "Upsell plays across the accounts you already own.",
    summary:
      "Growth inside the accounts you already own — usage signals, renewal timing, and the upsell plays worth running.",
    instructions:
      "Only suggest expansion when there's a real usage or headcount signal. Keep outreach low-pressure and value-first.",
    updated: "Updated last week",
    tone: "amber",
    conversations: [
      { id: "ex-1", title: "Cobalt Systems expansion", updated: "2d ago", contextPct: 38 },
      { id: "ex-2", title: "Seat-growth accounts", updated: "Last week", contextPct: 71 },
      { id: "ex-3", title: "Upsell email templates", updated: "Last week", contextPct: 19 },
    ],
  },
  {
    id: "outbound",
    name: "Outbound Experiments",
    description: "New segments and messaging tests in flight.",
    summary:
      "A testing ground for new segments and messaging — what's working, what's not, and what to try next.",
    instructions:
      "Treat these as experiments. Note the hypothesis behind each test and keep messaging concise.",
    updated: "Updated last week",
    tone: "teal",
    conversations: [
      { id: "ob-1", title: "Outreach to fintech founders", updated: "Last week", contextPct: 44 },
      { id: "ob-2", title: "Subject-line tests", updated: "Last week", contextPct: 88 },
      { id: "ob-3", title: "New segment: vertical SaaS", updated: "2w ago", contextPct: 15 },
    ],
  },
  {
    id: "renewals",
    name: "Renewals",
    description: "At-risk accounts and renewal timing to stay ahead of.",
    summary:
      "Staying ahead of churn — at-risk accounts, renewal dates, and the nudges that keep deals warm.",
    instructions:
      "Surface renewals 60 days out. For quiet accounts, draft a light nudge first; escalate only if there's no reply.",
    updated: "Updated 3d ago",
    tone: "indigo",
    conversations: [
      { id: "rn-1", title: "Northwind follow-up", updated: "3d ago", contextPct: 24 },
      { id: "rn-2", title: "Renewals due in 60 days", updated: "Last week", contextPct: 56 },
    ],
  },
];
