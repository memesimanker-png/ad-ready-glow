import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CookieConsent } from "./CookieConsent";
import { DailyKeyReminderBar } from "./DailyKeyReminderBar";
import TranslationIndicator from "./TranslationIndicator";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DailyKeyReminderBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
      <TranslationIndicator />
    </div>
  );
}

