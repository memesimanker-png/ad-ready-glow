import { forwardRef } from "react";
import { Link } from "react-router-dom";

export const Footer = forwardRef<HTMLElement>(function Footer(_, ref) {
  return (
    <footer ref={ref} className="border-t border-border/50 bg-card/30 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/combo-wick-logo.png" alt="ComboWick" className="h-8 w-8 rounded" />
              <span className="font-heading font-bold text-lg">ComboWick</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your marketplace for premium Roblox accounts, game keys, and authentic Jamaican natural oils. Instant delivery, verified products, and secure PayPal payments.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/scripts" className="hover:text-foreground transition-colors">Scripts</Link></li>
              <li><Link to="/keys" className="hover:text-foreground transition-colors">License Keys</Link></li>
              <li><Link to="/executors" className="hover:text-foreground transition-colors">Executors</Link></li>
              <li><Link to="/payment" className="hover:text-foreground transition-colors">Premium Access</Link></li>
              <li><Link to="/roblox-accounts" className="hover:text-foreground transition-colors">Roblox Accounts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/guides" className="hover:text-foreground transition-colors">Guides & Tutorials</Link></li>
              <li><Link to="/tutorials" className="hover:text-foreground transition-colors">Lua Tutorials</Link></li>
              <li><Link to="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/changelog" className="hover:text-foreground transition-colors">Changelog</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/fair-use" className="hover:text-foreground transition-colors">Fair Use Policy</Link></li>
              <li><Link to="/anti-cheat-guide" className="hover:text-foreground transition-colors">Anti-Cheat Guide</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://discord.com/invite/ufrz9Zaqs8" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Discord Community
                </a>
              </li>
              <li>
                <a href="mailto:support@combowick.com" className="hover:text-foreground transition-colors">
                  support@combowick.com
                </a>
              </li>
              <li><Link to="/login" className="hover:text-foreground transition-colors">Sign In / Dashboard</Link></li>
              <li className="text-xs pt-2">Response time: within 24 hours</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024–{new Date().getFullYear()} ComboWick. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Secure payments powered by PayPal • SSL Encrypted
          </p>
        </div>
      </div>
    </footer>
  );
});
