// Automatic, recurring day-based discounts for PREMIUM KEYS only.
// The $5 7-day trial is never discounted. Prices restore automatically
// as soon as the day window ends (everything is computed live from UTC).

export type AutoDiscount = { percent: number; label: string };

type Rule = {
  /** UTC weekdays this rule is active on (0 = Sunday). */
  days: number[];
  label: string;
  /** percent off per tier id */
  tiers: Record<string, number>;
};

const RULES: Rule[] = [
  {
    days: [1], // Monday
    label: "Monday Reset Sale",
    tiers: { monthly: 15, lifetime: 10 },
  },
  {
    days: [3], // Wednesday
    label: "Midweek Deal",
    tiers: { monthly: 10, lifetime: 10 },
  },
  {
    days: [5, 6, 0], // Friday → Sunday
    label: "Weekend Sale",
    tiers: { monthly: 20, lifetime: 15 },
  },
];

/** Tiers that may never be auto-discounted. */
const EXCLUDED = new Set(["trial-7day"]);

export function getAutoDiscount(tierId: string, now: Date = new Date()): AutoDiscount | null {
  if (EXCLUDED.has(tierId)) return null;
  const day = now.getUTCDay();
  let best: AutoDiscount | null = null;
  for (const rule of RULES) {
    if (!rule.days.includes(day)) continue;
    const percent = rule.tiers[tierId];
    if (!percent) continue;
    if (!best || percent > best.percent) best = { percent, label: rule.label };
  }
  return best;
}
