import React, { createContext, useContext, useState, useCallback } from "react";
import { LangCode, getTranslation } from "./translations";

interface TranslationContextType {
  currentLanguage: LangCode;
  setLanguage: (langCode: string) => void;
  t: (text: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: "en",
  setLanguage: () => {},
  t: (text: string) => text,
});

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LangCode>(() => {
    const saved = localStorage.getItem("combowick-lang");
    return (saved as LangCode) || "en";
  });

  const setLanguage = useCallback((langCode: string) => {
    setCurrentLanguage(langCode as LangCode);
    localStorage.setItem("combowick-lang", langCode);
    document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = langCode;
  }, []);

  const t = useCallback((text: string) => {
    return getTranslation(currentLanguage, text);
  }, [currentLanguage]);

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
