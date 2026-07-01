import { useState } from "react";
import { Check } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { saveProfile } from "@/lib/demo-store";

import OnboardingChat from "./OnboardingChat";

type Step = "name" | "workspace" | "chat";
const ORDER: Step[] = ["name", "workspace", "chat"];
const STEP_LABEL: Record<Step, string> = {
  name: "You",
  workspace: "Workspace",
  chat: "Company profile",
};

function Stepper({ current }: { current: Step }) {
  const currentIdx = ORDER.indexOf(current);
  return (
    <ol className="flex items-center gap-2">
      {ORDER.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={s} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
                done && "bg-secondary text-secondary-foreground",
                active && "bg-primary text-primary-foreground",
                !done && !active && "bg-muted text-muted-foreground"
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-xs font-semibold sm:inline",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {STEP_LABEL[s]}
            </span>
            {i < ORDER.length - 1 && (
              <span className="mx-1 hidden h-px w-6 bg-border sm:inline-block" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [workspace, setWorkspace] = useState("");

  if (step === "chat") {
    return (
      <OnboardingChat
        name={name.trim() || "there"}
        workspace={workspace.trim() || "your workspace"}
      />
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-soft" />

      <div className="flex w-full max-w-md flex-col items-center">
        <div className="mb-8 flex items-center gap-2.5">
          <Logo className="h-9 w-9" />
          <span className="font-display text-xl font-extrabold tracking-tight">
            Mateos
          </span>
        </div>

        <div className="mb-7">
          <Stepper current={step} />
        </div>

        {step === "name" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep("workspace");
            }}
            className="w-full rounded-lg border bg-card p-7 shadow-md"
          >
            <h1 className="font-display text-2xl font-bold tracking-tight">
              First, what should we call you?
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Mateos uses your name to keep things personal.
            </p>

            <div className="mt-6 flex flex-col gap-1.5">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Carmel"
                required
              />
            </div>

            <Button type="submit" className="mt-6 w-full">
              Continue
            </Button>
          </form>
        )}

        {step === "workspace" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveProfile({
                name: name.trim() || "Alex",
                workspace: workspace.trim() || "Acme Inc.",
              });
              setStep("chat");
            }}
            className="w-full rounded-lg border bg-card p-7 shadow-md"
          >
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Create your workspace
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              This is where your team, leads and conversations live - usually
              your company or team name.
            </p>

            <div className="mt-6 flex flex-col gap-1.5">
              <Label htmlFor="workspace">Workspace name</Label>
              <Input
                id="workspace"
                autoFocus
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                placeholder="e.g. Acme Inc."
                required
              />
            </div>

            <div className="mt-6 flex gap-2.5">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => setStep("name")}
              >
                Back
              </Button>
              <Button type="submit" className="flex-[2]">
                Continue
              </Button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Step {ORDER.indexOf(step) + 1} of {ORDER.length} · You can change any
          of this later
        </p>
      </div>
    </main>
  );
}
