/**
 * Talks to the local /api/chat proxy (see vite.config.ts), which holds the
 * Anthropic key server-side. Streams text back token by token.
 *
 * This single function is the only seam between the UI and Claude — to make
 * the rest of the app "real", a backend would expose the same /api/chat shape.
 */
export type MateosMessage = { role: "user" | "assistant"; content: string };

export function mateosSystem(name: string, workspace: string): string {
  return [
    `You are Mateos, an AI sales co-pilot — the "Sales Magician" by Mateos.ai, last-mile AI for small B2B sales teams.`,
    `You're helping ${name} at ${workspace}. You help them top their funnel (find new leads), find upsell opportunities in existing accounts, prepare for the day, prep for events and meetings, and think through sales strategy.`,
    `You work on owned surfaces only: you read context and draft messages, but the human always presses send — never claim to have actually sent, emailed, or messaged anyone.`,
    `Style: warm, concise and practical. Lead with the most useful next action, then offer a few concrete options. Prefer short paragraphs or tight bullet lists. Respond directly, with no preamble and no meta-commentary about your reasoning.`,
    `This is an early demo, so you don't have live access to their real inbox, calendar or CRM yet. When asked for specifics, give a brief, clearly-illustrative example rather than inventing real data.`,
  ].join("\n\n");
}

export async function streamMateos(
  messages: MateosMessage[],
  system: string,
  onText: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  // Static deploys (e.g. GitHub Pages) have no /api/chat backend. Reply with a
  // friendly note instead of erroring; the live chat works with `npm run dev`.
  if (import.meta.env.PROD) {
    const note =
      "I'm only live in the local demo — run the app with `npm run dev` to chat with me for real. Everything else here is clickable, so feel free to explore!";
    for (const word of note.split(" ")) {
      onText(word + " ");
      await new Promise((r) => setTimeout(r, 28));
    }
    return;
  }

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system }),
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`Mateos is unavailable (HTTP ${res.status}).`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      if (!json) continue;
      let evt: { text?: string; done?: boolean; error?: string };
      try {
        evt = JSON.parse(json);
      } catch {
        continue;
      }
      if (evt.error) throw new Error(evt.error);
      if (evt.text) onText(evt.text);
      if (evt.done) return;
    }
  }
}
