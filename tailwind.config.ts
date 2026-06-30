import type { Config } from "tailwindcss";

/**
 * Mateos.ai brand palette → Tailwind. (Ported from the magician app.)
 * Hierarchy: amber = primary · indigo = secondary · teal = accent.
 * shadcn/ui semantic tokens are wired to CSS variables in src/index.css.
 */
const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1180px" },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        success: "var(--success)",
        warning: "var(--warning)",

        // --- raw brand ramps (use sparingly; prefer semantic tokens) ---
        amber: {
          50: "#FFF7F2", 100: "#FFEDE1", 200: "#FFD8BF", 300: "#FFC097", 400: "#FFA56C",
          500: "#FF8C42", 600: "#DD7A3C", 700: "#B66535", 800: "#8F512E", 900: "#683C27",
        },
        indigo: {
          50: "#F4F3FD", 100: "#E5E3FB", 200: "#C7C5F7", 300: "#A5A0F2", 400: "#7F79ED",
          500: "#5B53E8", 600: "#5049CB", 700: "#433DA9", 800: "#373287", 900: "#2A2666",
        },
        teal: {
          50: "#EFFAFA", 100: "#DAF5F4", 200: "#B0E9E8", 300: "#7FDBDA", 400: "#4ACCCA",
          500: "#17BEBB", 600: "#15A5A4", 700: "#14888A", 800: "#126C6F", 900: "#104F55",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(143, 81, 46, 0.06)",
        sm: "0 2px 6px rgba(143, 81, 46, 0.09)",
        md: "0 6px 16px rgba(143, 81, 46, 0.11)",
        lg: "0 14px 34px rgba(143, 81, 46, 0.15)",
        xl: "0 28px 60px rgba(143, 81, 46, 0.18)",
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #FF8C42 0%, #17BEBB 52%, #5B53E8 100%)",
        "gradient-soft": "linear-gradient(135deg, #FFF7F2 0%, #F4F3FD 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
