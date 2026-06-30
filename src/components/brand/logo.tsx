import { cn } from "@/lib/utils";

/**
 * Mateos.ai mark — three circles in a 2x2 grid (top-left omitted),
 * one per brand color: amber, teal, indigo.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="43 43 114 114"
      role="img"
      aria-label="Mateos.ai"
      className={cn("h-10 w-10", className)}
    >
      <circle cx="130" cy="70" r="27" fill="#FF8C42" />
      <circle cx="70" cy="130" r="27" fill="#17BEBB" />
      <circle cx="130" cy="130" r="27" fill="#5B53E8" />
    </svg>
  );
}
