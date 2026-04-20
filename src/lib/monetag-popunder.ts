// Centralized Monetag popunder loader with strict cross-page cooldown.
// Prevents the popunder script from being injected more than once every
// COOLDOWN_MS, even across route changes / new tabs (uses localStorage).
//
// Why this exists: previously each page (Scripts, ScriptDetail, AccessKey)
// injected the tag itself with its own sessionStorage key, so navigating
// between them fired the popunder multiple times in a session.

const ZONE = 10877295;
const SCRIPT_SRC = "https://al5sm.com/tag.min.js";
const COOLDOWN_KEY = "combowick-popunder-last-fired";
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes — matches direct-link gate
const SCRIPT_ID = "monetag-popunder-tag";

export function loadMonetagPopunder(): void {
  if (typeof window === "undefined") return;

  // Already injected on this page? do nothing.
  if (document.getElementById(SCRIPT_ID)) return;

  // Cooldown guard
  const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
  if (last && Date.now() - last < COOLDOWN_MS) return;

  const s = document.createElement("script");
  s.id = SCRIPT_ID;
  s.src = SCRIPT_SRC;
  s.dataset.zone = String(ZONE);
  s.async = true;
  document.body.appendChild(s);

  localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
}
