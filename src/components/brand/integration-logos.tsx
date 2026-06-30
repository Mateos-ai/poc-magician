/** Integration marks. Real product logos live in /public; Apollo is drawn. */
import { cn } from "@/lib/utils";

export function GoogleCalendarLogo({ className }: { className?: string }) {
  return (
    <img
      src="/calendar.webp"
      alt="Google Calendar"
      className={cn("object-contain", className)}
    />
  );
}

export function GmailLogo({ className }: { className?: string }) {
  return (
    <img src="/gmail.webp" alt="Gmail" className={cn("object-contain", className)} />
  );
}

export function HubSpotLogo({ className }: { className?: string }) {
  return (
    <img
      src="/hubspot.webp"
      alt="HubSpot"
      className={cn("rounded-[3px] object-contain", className)}
    />
  );
}

export function ApolloLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="13" fill="none" stroke="#6366F1" strokeWidth="3" />
      <circle cx="24" cy="24" r="4" fill="#6366F1" />
      <path
        d="M24 11v6M24 31v6M11 24h6M31 24h6"
        stroke="#6366F1"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
