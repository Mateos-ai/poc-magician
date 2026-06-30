import { useRef, useState } from "react";
import {
  Briefcase,
  Check,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Person = { id: string; name: string };

const TEAM: Person[] = [
  { id: "p1", name: "Alex Carmel" },
  { id: "p2", name: "Dana Roth" },
  { id: "p3", name: "Sam Okoro" },
  { id: "p4", name: "Priya Nair" },
  { id: "p5", name: "Tom Bennett" },
];
const personName = (id: string) => TEAM.find((p) => p.id === id)?.name ?? id;
const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

type ICP = {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: string;
  locations: string[];
  titles: string[];
  assigned: string[];
};

const INITIAL: ICP[] = [
  {
    id: "icp1",
    name: "Recruiting & Staffing Firms",
    description: "Our bread and butter — agencies placing senior roles and hiring fast.",
    industry: "Recruiting & staffing",
    size: "50–200 employees",
    locations: ["United Kingdom", "Ireland", "Netherlands"],
    titles: ["Head of Talent", "VP People", "Managing Director"],
    assigned: ["p1", "p2"],
  },
  {
    id: "icp2",
    name: "Scaling Tech Startups",
    description: "Series A–B software companies building out their first sales team.",
    industry: "B2B SaaS",
    size: "20–100 employees",
    locations: ["United States", "Germany"],
    titles: ["Head of Sales", "Founder / CEO"],
    assigned: ["p3"],
  },
];

export default function IdealCustomers() {
  const [icps, setIcps] = useState<ICP[]>(INITIAL);
  const [editingId, setEditingId] = useState<string | null>(null);
  const idRef = useRef(1);

  const update = (id: string, patch: Partial<ICP>) =>
    setIcps((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  function addIcp() {
    const id = `new-${idRef.current++}`;
    setIcps((prev) => [
      ...prev,
      { id, name: "New ideal customer", description: "", industry: "", size: "", locations: [], titles: [], assigned: [] },
    ]);
    setEditingId(id);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-7">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Ideal Customers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The profiles Mateos targets and scores every lead against. Assign the
            reps who own each one.
          </p>
        </div>
        <Button onClick={addIcp}>
          <Plus className="h-4 w-4" />
          Add ICP
        </Button>
      </header>

      <div className="mt-6 flex flex-col gap-4">
        {icps.map((icp) => (
          <IcpCard
            key={icp.id}
            icp={icp}
            editing={editingId === icp.id}
            onToggleEdit={() => setEditingId((cur) => (cur === icp.id ? null : icp.id))}
            onDelete={() => {
              setIcps((prev) => prev.filter((i) => i.id !== icp.id));
              if (editingId === icp.id) setEditingId(null);
            }}
            onUpdate={(patch) => update(icp.id, patch)}
          />
        ))}
      </div>
    </div>
  );
}

function IcpCard({
  icp,
  editing,
  onToggleEdit,
  onDelete,
  onUpdate,
}: {
  icp: ICP;
  editing: boolean;
  onToggleEdit: () => void;
  onDelete: () => void;
  onUpdate: (patch: Partial<ICP>) => void;
}) {
  const [assignOpen, setAssignOpen] = useState(false);
  const unassigned = TEAM.filter((p) => !icp.assigned.includes(p.id));

  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs">
      {/* header */}
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              value={icp.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-2.5 py-1 font-display text-base font-bold focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
            />
          ) : (
            <h2 className="font-display text-base font-bold tracking-tight">{icp.name}</h2>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={onToggleEdit}
            title={editing ? "Done" : "Edit"}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted",
              editing ? "text-amber-700" : "text-muted-foreground"
            )}
          >
            {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </button>
          <button
            onClick={onDelete}
            title="Delete ICP"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* description */}
      {editing ? (
        <textarea
          value={icp.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={2}
          placeholder="Who are they?"
          className="mt-2 w-full resize-none rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
        />
      ) : (
        icp.description && (
          <p className="mt-1.5 text-sm text-muted-foreground">{icp.description}</p>
        )
      )}

      {/* industry + size */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Field label="Industry" icon={Briefcase} value={icp.industry} editing={editing} onChange={(v) => onUpdate({ industry: v })} />
        <Field label="Company size" icon={Users} value={icp.size} editing={editing} onChange={(v) => onUpdate({ size: v })} />
      </div>

      {/* locations */}
      <ChipField
        label="Locations"
        icon={MapPin}
        items={icp.locations}
        editing={editing}
        placeholder="Add a location"
        onChange={(items) => onUpdate({ locations: items })}
      />

      {/* buyer titles */}
      <ChipField
        label="Buyer titles"
        icon={Briefcase}
        items={icp.titles}
        editing={editing}
        placeholder="Add a title"
        onChange={(items) => onUpdate({ titles: items })}
      />

      {/* assigned */}
      <div className="mt-4 border-t pt-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
          Assigned to
        </p>
        <div className="relative mt-2 flex flex-wrap items-center gap-2">
          {icp.assigned.map((pid) => (
            <span
              key={pid}
              className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 py-0.5 pl-0.5 pr-2 text-xs font-semibold"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                {initials(personName(pid))}
              </span>
              {personName(pid)}
              <button
                onClick={() => onUpdate({ assigned: icp.assigned.filter((p) => p !== pid) })}
                className="text-muted-foreground hover:text-destructive"
                title="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          <button
            onClick={() => setAssignOpen((o) => !o)}
            disabled={unassigned.length === 0}
            className="flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-amber-700 disabled:opacity-50"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Assign
          </button>

          {assignOpen && unassigned.length > 0 && (
            <>
              <button className="fixed inset-0 z-40 cursor-default" onClick={() => setAssignOpen(false)} aria-hidden />
              <div className="absolute left-0 top-9 z-50 w-52 rounded-lg border bg-popover p-1 shadow-lg">
                {unassigned.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onUpdate({ assigned: [...icp.assigned, p.id] });
                      setAssignOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] font-medium transition-colors hover:bg-muted"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                      {initials(p.name)}
                    </span>
                    {p.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  editing,
  onChange,
}: {
  label: string;
  icon: typeof Briefcase;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
        />
      ) : (
        <p className="mt-1 text-sm font-medium">{value || "—"}</p>
      )}
    </div>
  );
}

function ChipField({
  label,
  icon: Icon,
  items,
  editing,
  placeholder,
  onChange,
}: {
  label: string;
  icon: typeof Briefcase;
  items: string[];
  editing: boolean;
  placeholder: string;
  onChange: (items: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v) onChange([...items, v]);
    setDraft("");
  };
  return (
    <div className="mt-4">
      <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {items.map((it) => (
          <span
            key={it}
            className="flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium"
          >
            {it}
            {editing && (
              <button
                onClick={() => onChange(items.filter((x) => x !== it))}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
        {!editing && items.length === 0 && (
          <span className="text-xs text-muted-foreground">—</span>
        )}
        {editing && (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            onBlur={add}
            placeholder={placeholder}
            className="h-7 w-36 rounded-full border border-dashed border-border bg-background px-3 text-xs focus-visible:border-primary focus-visible:outline-none"
          />
        )}
      </div>
    </div>
  );
}
