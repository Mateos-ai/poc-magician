import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Demo proxy: the browser POSTs to /api/chat, and THIS (server-side) code
 * talks to Claude with the key from .env. The key never reaches the bundle.
 * Replies stream back as simple SSE lines: {"text": "..."} then {"done": true}.
 */
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.ANTHROPIC_API_KEY;

  return {
    // Relative base so the built site works under any sub-path (GitHub Pages
    // project URL like /poc-maigician/). Dev stays at root.
    base: command === "build" ? "./" : "/",
    plugins: [
      react(),
      {
        name: "mateos-claude-proxy",
        configureServer(server) {
          server.middlewares.use("/api/chat", async (req, res) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              res.end("Method Not Allowed");
              return;
            }

            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");

            const send = (obj: unknown) =>
              res.write(`data: ${JSON.stringify(obj)}\n\n`);

            if (!apiKey) {
              send({ error: "No ANTHROPIC_API_KEY found in .env" });
              res.end();
              return;
            }

            let raw = "";
            for await (const chunk of req) raw += chunk;
            let body: {
              messages?: Anthropic.MessageParam[];
              system?: string;
            } = {};
            try {
              body = JSON.parse(raw || "{}");
            } catch {
              /* fall through to empty body */
            }

            const client = new Anthropic({ apiKey });
            try {
              const stream = client.messages.stream({
                model: "claude-opus-4-8",
                max_tokens: 1024,
                system: body.system,
                messages: body.messages ?? [],
              });
              stream.on("text", (delta) => send({ text: delta }));
              await stream.finalMessage();
              send({ done: true });
              res.end();
            } catch (err) {
              const message =
                err instanceof Error ? err.message : "Mateos request failed";
              send({ error: message });
              res.end();
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
