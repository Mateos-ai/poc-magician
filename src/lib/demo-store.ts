/**
 * Tiny localStorage-backed profile so the workspace + name carry from
 * onboarding into the app shell. Demo only — no real persistence layer.
 */
export type DemoProfile = { name: string; workspace: string };

const KEY = "mateos-demo-profile";
const FALLBACK: DemoProfile = { name: "Alex", workspace: "Acme Inc." };

export function saveProfile(p: DemoProfile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore — demo only */
  }
}

export function getProfile(): DemoProfile {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...FALLBACK, ...JSON.parse(raw) };
  } catch {
    /* ignore — demo only */
  }
  return FALLBACK;
}
