import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { LangCode, EN_TEXTS } from "./translations";
import { supabase } from "@/integrations/supabase/client";
import { startAutoTranslator, stopAutoTranslator } from "./auto-translator";

interface TranslationContextType {
  currentLanguage: LangCode;
  setLanguage: (langCode: string) => void;
  t: (text: string) => string;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: "en",
  setLanguage: () => {},
  t: (text: string) => text,
  isTranslating: false,
});

// Load cache from localStorage on init
const translationCache: Record<string, Record<string, string>> = (() => {
  try {
    const saved = localStorage.getItem("combowick-translations");
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
})();

function persistCache() {
  try {
    localStorage.setItem("combowick-translations", JSON.stringify(translationCache));
  } catch { /* quota exceeded, ignore */ }
}

// Queue for pending translation requests
let pendingTexts: Set<string> = new Set();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushPromise: Promise<void> | null = null;
let currentFlushLang: string | null = null;

async function fetchTranslations(lang: string, texts: string[]): Promise<Record<string, string>> {
  if (!translationCache[lang]) translationCache[lang] = {};

  // Filter out already cached (in memory + localStorage)
  const needed = texts.filter(t => !translationCache[lang][t]);
  if (needed.length === 0) return translationCache[lang];

  try {
    const { data, error } = await supabase.functions.invoke("translate", {
      body: { texts: needed, language: lang },
    });

    if (!error && data?.translations) {
      Object.assign(translationCache[lang], data.translations);
      persistCache();
    }
  } catch (e) {
    console.error("Translation fetch error:", e);
  }

  return translationCache[lang];
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LangCode>(() => {
    const saved = localStorage.getItem("combowick-lang");
    return (saved as LangCode) || "en";
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [, forceUpdate] = useState(0);
  const langRef = useRef(currentLanguage);

  const setLanguage = useCallback((langCode: string) => {
    const code = langCode as LangCode;
    setCurrentLanguage(code);
    langRef.current = code;
    localStorage.setItem("combowick-lang", langCode);
    document.documentElement.lang = langCode;
  }, []);

  // When language changes, preload all EN_TEXTS translations + start DOM auto-translator
  useEffect(() => {
    if (currentLanguage === "en") {
      stopAutoTranslator();
      startAutoTranslator("en");
      return;
    }
    setIsTranslating(true);
    const allTexts = Object.values(EN_TEXTS);
    fetchTranslations(currentLanguage, allTexts).then(() => {
      setIsTranslating(false);
      forceUpdate(n => n + 1);
      // Start auto-translating any DOM text not handled by t()
      startAutoTranslator(currentLanguage);
    });
    return () => { stopAutoTranslator(); };
  }, [currentLanguage]);

  // Flush queued texts
  const flushPending = useCallback(() => {
    const lang = langRef.current;
    if (lang === "en" || pendingTexts.size === 0) return;

    const texts = Array.from(pendingTexts);
    pendingTexts = new Set();

    flushPromise = fetchTranslations(lang, texts).then(() => {
      forceUpdate(n => n + 1);
      flushPromise = null;
    });
  }, []);

  const t = useCallback((text: string) => {
    const lang = langRef.current;
    // Resolve EN value: if `text` is a key in EN_TEXTS use the value, otherwise treat `text` itself as the source.
    const enValue = EN_TEXTS[text] ?? text;
    if (lang === "en") return enValue;

    // Look up cache by the English source text (not the lookup key)
    const cached = translationCache[lang]?.[enValue];
    if (cached) return cached;

    // Queue the English source text for batch fetch
    pendingTexts.add(enValue);
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = setTimeout(flushPending, 50);

    // Return English as fallback while loading
    return enValue;
  }, [flushPending]);

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t, isTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
