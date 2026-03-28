import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Shield, Zap, Check, Users, Lock, HeadphonesIcon,
  ChevronDown, ChevronUp, Star, Clock, Download, Eye
} from "lucide-react";
import { useState } from "react";

const packages = [
  { size: 25, price: 6, perAccount: "0.24", label: "Starter", popular: false },
  { size: 50, price: 11, perAccount: "0.22", label: "Popular", popular: true },
  { size: 100, price: 20, perAccount: "0.20", label: "Pro", popular: false },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors rounded-lg"
      >
        <span className="font-medium pr-4">{q}</span>
        {open ? <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>
      )}
    </div>
  );
}

export default function RobloxAccounts() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 sm:py-20 bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold text-success uppercase tracking-wider">In Stock • Instant Delivery</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Buy Verified <span className="text-gradient-primary">Roblox Accounts</span> in Bulk
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            ComboWick provides verified, ready-to-use Roblox accounts for developers, content creators, and studios. Every account is manually verified with working credentials, valid email addresses, and proper age verification. Choose from packages of 25, 50, or 100 accounts with instant automated delivery after PayPal checkout.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">What's Included With Every Account</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 text-lg">
            We don't cut corners. Every Roblox account we sell goes through a rigorous verification process before being listed in our inventory.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Manual Verification", desc: "Each account is individually checked by our team to ensure the username and password work correctly, the email is verified, and the account isn't flagged or banned." },
              { icon: Zap, title: "Instant Automated Delivery", desc: "Once your PayPal payment is confirmed, our system automatically delivers account credentials to your ComboWick dashboard within seconds. No manual processing delays." },
              { icon: Lock, title: "Secure Credential Storage", desc: "Your purchased account credentials are stored in your encrypted dashboard. Only you can access them. We recommend changing passwords immediately after receiving your accounts." },
              { icon: Download, title: "Bulk Export Options", desc: "Download all your account credentials as a formatted text file for easy management. Perfect for developers who need to import credentials into testing tools or scripts." },
              { icon: Eye, title: "Account Details Visible", desc: "View each account's username, password, creation date, and verification status directly in your dashboard. Full transparency on what you're getting." },
              { icon: HeadphonesIcon, title: "24/7 Replacement Guarantee", desc: "If any account doesn't work as described, our Discord support team is available around the clock to provide a replacement or resolve the issue." },
            ].map((item) => (
              <Card key={item.title} className="p-6 bg-glass hover:border-primary/30 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">Who Buys Roblox Accounts?</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 text-lg">
            Our customers span a wide range of use cases. Here's why thousands of people trust ComboWick for their Roblox account needs.
          </p>
          <div className="space-y-6">
            {[
              {
                title: "Game Developers & QA Testers",
                desc: "Roblox game developers frequently need multiple accounts to test their games across different scenarios — testing multiplayer functionality, verifying permission systems, simulating different player states, and stress-testing game servers. Instead of manually creating and verifying dozens of accounts, developers save hours by purchasing pre-verified accounts from ComboWick. Our accounts are ready to use immediately, letting developers focus on building great games instead of managing test accounts."
              },
              {
                title: "Content Creators & YouTubers",
                desc: "Roblox content creators and YouTubers often need multiple accounts for recording content — whether it's comparing game experiences from different perspectives, creating tutorial videos that require fresh accounts, or managing community events with alt accounts. ComboWick provides instant access to verified accounts, eliminating the tedious process of creating, verifying emails, and setting up new accounts manually."
              },
              {
                title: "Studio Teams & Organizations",
                desc: "Professional Roblox studios managing multiple games need dedicated accounts for different team members, testing environments, and production workflows. Our Pro package (100 accounts) is designed specifically for teams that need reliable, verified accounts at scale. With priority support included, studio teams get the responsive service they need for time-sensitive projects."
              },
              {
                title: "Backup & Security-Conscious Players",
                desc: "Some players purchase additional accounts as backups in case their primary account faces issues. Having verified backup accounts means you're never locked out of the Roblox ecosystem. These accounts can also be used for managing separate game inventories or participating in different communities without mixing identities."
              },
            ].map((item) => (
              <Card key={item.title} className="p-6 bg-glass">
                <h3 className="font-heading text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">Account Packages & Pricing</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 text-lg">
            All packages include verified accounts with instant automated delivery. Larger packages offer better per-account value, saving you up to 17% compared to the Starter package.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <Card
                key={pkg.size}
                className={`p-6 sm:p-8 relative transition-all duration-300 ${
                  pkg.popular
                    ? "border-primary/50 bg-primary/5 animate-glow scale-105"
                    : "bg-glass hover:border-primary/30"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">{pkg.label}</h3>
                  <div className="text-4xl font-bold mb-1">${pkg.price}</div>
                  <p className="text-sm text-muted-foreground">{pkg.size} Accounts • ${pkg.perAccount}/account</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Verified accounts</li>
                  <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Instant delivery</li>
                  <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> PayPal buyer protection</li>
                  <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Dashboard access</li>
                  {pkg.size >= 50 && <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Bulk discount applied</li>}
                  {pkg.size >= 100 && <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" /> Priority support</li>}
                </ul>
                <Link to="/login">
                  <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                    Purchase Now
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Roblox Accounts FAQ</h2>
          <div className="space-y-3">
            <FAQItem
              q="What exactly do I receive after purchasing?"
              a="After completing your PayPal payment, you'll receive a set of account credentials (username and password) delivered to your ComboWick dashboard. Each account has a verified email address, working login credentials, and has been checked for bans or restrictions. You can view, copy, or download all credentials from your dashboard."
            />
            <FAQItem
              q="How long does delivery take?"
              a="Delivery is fully automated and happens within seconds of PayPal payment confirmation. There is no manual processing step. As soon as PayPal notifies our system that your payment is complete, the accounts appear in your dashboard immediately."
            />
            <FAQItem
              q="Can I use these accounts for game development testing?"
              a="Absolutely. Many of our customers are Roblox game developers who need multiple accounts for testing multiplayer features, permission systems, and game mechanics. Our accounts are fully functional Roblox accounts that work identically to manually created ones."
            />
            <FAQItem
              q="What if an account doesn't work?"
              a="We stand behind every account we sell. If any account's credentials don't work or the account is restricted, contact our 24/7 Discord support team. We'll either replace the account or resolve the issue promptly. Your satisfaction is guaranteed."
            />
            <FAQItem
              q="Do you offer custom bulk orders over 100 accounts?"
              a="Yes. For orders exceeding 100 accounts, please contact us through Discord for custom pricing. We regularly fulfill orders of 500+ accounts for studios and large development teams. Custom orders include dedicated support and flexible delivery options."
            />
            <FAQItem
              q="Is this legal and safe?"
              a="Purchasing Roblox accounts is a common practice for development, testing, and content creation purposes. All transactions are processed through PayPal with full buyer protection. We use SSL encryption for all data transfer, and your credentials are stored securely in your encrypted dashboard."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">What Customers Say About Our Accounts</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Alex R.", role: "Game Developer", text: "Needed 100 test accounts for my Roblox game's multiplayer testing. ComboWick delivered all of them instantly. Every single one worked perfectly. Saved me an entire day of work creating accounts manually." },
              { name: "Sarah M.", role: "Content Creator", text: "I've been buying accounts from ComboWick for months now for my YouTube channel. The accounts are always verified and work on the first try. Their Discord support replied within 5 minutes when I had a question." },
              { name: "Marcus J.", role: "Studio Owner", text: "Our studio needed 200+ accounts for our new game's closed beta testing. ComboWick handled the custom order professionally. Best value and service I've found anywhere online." },
            ].map((t) => (
              <Card key={t.name} className="p-6 bg-glass">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Ready to Get Your Roblox Accounts?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join 10,000+ customers who trust ComboWick for verified Roblox accounts. Instant delivery, PayPal protection, and 24/7 support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing">
              <Button size="lg" className="text-base px-8 py-6">View Packages</Button>
            </a>
            <Link to="/blog/roblox-account-security-guide">
              <Button variant="outline" size="lg" className="text-base px-8 py-6">Read Security Guide</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
