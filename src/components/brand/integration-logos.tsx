/** Integration marks. Real product logos live in /public; Apollo is drawn. */
import { cn } from "@/lib/utils";

const base = import.meta.env.BASE_URL;

export function GoogleCalendarLogo({ className }: { className?: string }) {
  return (
    <img
      src={base + "calendar.webp"}
      alt="Google Calendar"
      className={cn("object-contain", className)}
    />
  );
}

export function GmailLogo({ className }: { className?: string }) {
  return (
    <img src={base + "gmail.webp"} alt="Gmail" className={cn("object-contain", className)} />
  );
}

export function HubSpotLogo({ className }: { className?: string }) {
  return (
    <img
      src={base + "hubspot.webp"}
      alt="HubSpot"
      className={cn("rounded-[3px] object-contain", className)}
    />
  );
}

export function ApolloLogo({ className }: { className?: string }) {
  return (
    <img src={base + "apollo.webp"} alt="Apollo" className={cn("object-contain", className)} />
  );
}

export function SalesforceLogo({ className }: { className?: string }) {
  return (
    <img src={base + "salesforce.webp"} alt="Salesforce" className={cn("object-contain", className)} />
  );
}

export function SlackLogo({ className }: { className?: string }) {
  return (
    <img src={base + "slack.webp"} alt="Slack" className={cn("object-contain", className)} />
  );
}

export function OutlookLogo({ className }: { className?: string }) {
  return (
    <img src={base + "outlook.webp"} alt="Outlook" className={cn("object-contain", className)} />
  );
}

export function LinkedinLogo({ className }: { className?: string }) {
  return (
    <img src={base + "linkedin.webp"} alt="LinkedIn" className={cn("object-contain", className)} />
  );
}

export function NotionLogo({ className }: { className?: string }) {
  return (
    <img src={base + "notion.webp"} alt="Notion" className={cn("object-contain", className)} />
  );
}

export function AttioLogo({ className }: { className?: string }) {
  return (
    <img src={base + "attio.webp"} alt="Attio" className={cn("object-contain", className)} />
  );
}

export function DiscordLogo({ className }: { className?: string }) {
  return (
    <img src={base + "discord.webp"} alt="Discord" className={cn("object-contain", className)} />
  );
}

export function WhatsappLogo({ className }: { className?: string }) {
  return (
    <img src={base + "whatsapp.webp"} alt="WhatsApp" className={cn("object-contain", className)} />
  );
}

export function TelegramLogo({ className }: { className?: string }) {
  return (
    <img src={base + "telegram.webp"} alt="Telegram" className={cn("object-contain", className)} />
  );
}

export function TeamsLogo({ className }: { className?: string }) {
  return (
    <img src={base + "teams.webp"} alt="Microsoft Teams" className={cn("object-contain", className)} />
  );
}

export function ZoomLogo({ className }: { className?: string }) {
  return (
    <img src={base + "zoom.webp"} alt="Zoom" className={cn("object-contain", className)} />
  );
}

export function CalendlyLogo({ className }: { className?: string }) {
  return (
    <img src={base + "calendly.webp"} alt="Calendly" className={cn("object-contain", className)} />
  );
}

export function FirefliesLogo({ className }: { className?: string }) {
  return (
    <img src={base + "fireflies.webp"} alt="Fireflies" className={cn("object-contain", className)} />
  );
}

export function LushaLogo({ className }: { className?: string }) {
  return (
    <img src={base + "lusha.webp"} alt="Lusha" className={cn("object-contain", className)} />
  );
}

export function HunterLogo({ className }: { className?: string }) {
  return (
    <img src={base + "hunter.webp"} alt="Hunter" className={cn("object-contain", className)} />
  );
}

export function PipedriveLogo({ className }: { className?: string }) {
  return (
    <img src={base + "pipedrive.webp"} alt="Pipedrive" className={cn("object-contain", className)} />
  );
}

export function GrainLogo({ className }: { className?: string }) {
  return (
    <img src={base + "grain.png"} alt="Grain" className={cn("object-contain", className)} />
  );
}
