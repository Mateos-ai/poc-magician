import { useState } from "react";
import { Briefcase, Building2, Globe, MapPin, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/demo-store";

const FACTS = [
  { icon: Briefcase, label: "Industry", value: "Recruiting technology" },
  { icon: Users, label: "Employees", value: "50–200" },
  { icon: MapPin, label: "Headquarters", value: "London, UK" },
  { icon: Globe, label: "Founded", value: "2019" },
];

function EditableSection({
  title,
  initial,
}: {
  title: string;
  initial: string;
}) {
  const [text, setText] = useState(initial);
  const [saved, setSaved] = useState(true);
  return (
    <section className="rounded-xl border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold">{title}</h2>
        <Button
          size="sm"
          variant={saved ? "outline" : "default"}
          disabled={saved}
          onClick={() => setSaved(true)}
        >
          {saved ? "Saved" : "Save"}
        </Button>
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
        rows={3}
        className="mt-3 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
      />
    </section>
  );
}

export default function Company() {
  const { workspace } = getProfile();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-7">
      <header className="flex items-center gap-3">
        <img
          src={import.meta.env.BASE_URL + "acme.webp"}
          alt={workspace}
          className="h-12 w-12 shrink-0 rounded-xl object-cover shadow-xs"
        />
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            {workspace}
          </h1>
          <a
            href="#"
            className="font-mono text-xs text-muted-foreground hover:text-amber-700"
          >
            acme.com
          </a>
        </div>
      </header>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        The context Mateos uses for everything — who you are, what you sell, and
        how you talk about it. Keep it current and every draft gets sharper.
      </p>

      {/* facts */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.label} className="rounded-lg border bg-card p-3 shadow-xs">
            <f.icon className="h-4 w-4 text-muted-foreground" />
            <p className="mt-2 text-sm font-bold">{f.value}</p>
            <p className="text-[11px] text-muted-foreground">{f.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <EditableSection
          title="About"
          initial="Acme Inc. helps recruiting and staffing firms place senior roles faster. We pair a vetted candidate network with hands-on account management, so small agencies can punch above their weight."
        />
        <EditableSection
          title="What we sell"
          initial="A done-with-you executive search service — sourcing, screening and shortlists for senior and leadership hires, billed per placement with an optional retainer."
        />
        <EditableSection
          title="How we talk"
          initial="Warm, direct and practical. We lead with outcomes (time-to-hire, quality of hire), avoid jargon, and never over-promise. Every message should sound like a helpful peer, not a vendor."
        />
      </div>

      <p className="mt-5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Building2 className="h-3.5 w-3.5" />
        Pulled from your website during onboarding · edit anytime.
      </p>
    </div>
  );
}
