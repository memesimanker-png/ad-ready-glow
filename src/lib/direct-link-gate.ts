const DIRECT_LINK_URL = "https://omg10.com/4/10877293";
const COOLDOWN_KEY = "combowick-dl-cooldown";
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Returns true if the user is currently in cooldown (already clicked recently).
 */
export function isInCooldown(): boolean {
  const ts = localStorage.getItem(COOLDOWN_KEY);
  if (!ts) return false;
  return Date.now() - Number(ts) < COOLDOWN_MS;
}

/**
 * Returns remaining cooldown seconds, or 0 if expired.
 */
export function getCooldownRemaining(): number {
  const ts = localStorage.getItem(COOLDOWN_KEY);
  if (!ts) return 0;
  const remaining = COOLDOWN_MS - (Date.now() - Number(ts));
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

/**
 * Opens the direct link and sets the cooldown timestamp.
 */
export function triggerDirectLink(): void {
  localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
  window.open(DIRECT_LINK_URL, "_blank");
}
