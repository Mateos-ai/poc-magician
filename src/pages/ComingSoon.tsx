import { useNavigate } from "react-router-dom";
import { ArrowLeft, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-card shadow-sm">
        <Icon className="h-6 w-6 text-amber-700" />
      </span>
      <span className="mt-5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-teal-800">
        Designing next
      </span>
      <h2 className="mt-3 max-w-md font-display text-2xl font-extrabold tracking-tight">
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      <Button
        variant="outline"
        className="mt-6"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>
    </div>
  );
}
