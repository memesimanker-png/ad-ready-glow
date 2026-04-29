import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationBell } from "./NotificationBell";
import { useTranslation } from "@/lib/translation-context";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/scripts", label: "Scripts" },
  { to: "/keys", label: "Keys" },
  { to: "/executors", label: "Executors" },
  { to: "/premium-keys", label: "Premium" },
  { to: "/guides", label: "Guides" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/70 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <div className="relative">
              <img src="/images/combo-wick-logo.png" alt="ComboWick Logo" className="h-9 w-9 rounded-lg" />
              <div className="absolute inset-0 rounded-lg bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-heading font-bold text-lg tracking-wider">
              <span className="text-primary">COMBO</span>
              <span className="text-foreground">WICK</span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(link.label)}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden xl:flex items-center gap-3">
            <LanguageSelector />
            <NotificationBell />
            <a href="https://discord.com/invite/ufrz9Zaqs8" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-primary/20 text-primary hover:bg-primary/10 text-xs uppercase tracking-wider">
                {t("Discord")}
              </Button>
            </a>
            <Link to="/login">
              <Button size="sm" className="neon-glow text-xs uppercase tracking-wider font-semibold">
                {t("Sign In")}
              </Button>
            </Link>
          </div>

          <button className="xl:hidden p-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden border-t border-primary/10 bg-background/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <div className="pb-3 border-b border-border/50">
                <LanguageSelector dropUp={false} inline />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium uppercase tracking-wider transition-colors ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {t(link.label)}
                </Link>
              ))}
              <div className="pt-3 border-t border-border/50 space-y-2">
                <a href="https://discord.com/invite/ufrz9Zaqs8" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full border-primary/20">{t("Discord")}</Button>
                </a>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full neon-glow">{t("Sign In")}</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
