import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 mt-auto">
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
              <li><Link to="/roblox-accounts" className="hover:text-foreground transition-colors">Roblox Accounts</Link></li>
              <li><Link to="/premium-keys" className="hover:text-foreground transition-colors">Premium Keys</Link></li>
              <li><Link to="/oils" className="hover:text-foreground transition-colors">Natural Oils</Link></li>
              <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog & Guides</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
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
}
