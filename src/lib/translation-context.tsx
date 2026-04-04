import React, { createContext, useContext } from "react";

interface TranslationContextType {
  currentLanguage: string;
  setLanguage: (langCode: string) => void;
  t: (text: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: "en",
  setLanguage: () => {},
  t: (text: string) => text,
});

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  // Simple passthrough for now - English only
  const value: TranslationContextType = {
    currentLanguage: "en",
    setLanguage: () => {},
    t: (text: string) => text,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
