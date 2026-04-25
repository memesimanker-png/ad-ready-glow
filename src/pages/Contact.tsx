import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Clock, MapPin, Youtube } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

export default function Contact() {
  return (
    <Layout>
      <SEOHead
        title="Contact Combo_WICK — Discord, YouTube & Email Support | ComboWick"
        description="Get in touch with the Combo_WICK team. Real-time Discord support, YouTube channel @COMBO_WICK, and email contact for premium key activation, scripts, and Lua tutorial questions."
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Contact <span className="text-gradient-primary">Combo_WICK</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Questions about premium keys, script issues, executor recommendations, or Lua tutorials? Reach the Combo_WICK team through any of the channels below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: MessageSquare, title: "Discord Community (Fastest)", desc: "Our 50k+ Discord server is the fastest way to get help. Real-time answers from the team and the community — typically replied to within minutes, not hours.", contact: "Join the Combo_WICK Discord", href: "https://discord.com/invite/ufrz9Zaqs8" },
              { icon: Youtube, title: "YouTube — @COMBO_WICK", desc: "The official Combo_WICK YouTube channel. Script reviews, tutorials, executor showcases, and weekly updates. Comment on a video for slower public Q&A.", contact: "youtube.com/@COMBO_WICK", href: "https://www.youtube.com/@COMBO_WICK" },
              { icon: Mail, title: "Email Support", desc: "For formal requests, business inquiries, refund disputes covered by our policy, or anything you'd rather not handle in chat. Replied to within 24 hours on weekdays.", contact: "support@combowick.com", href: "mailto:support@combowick.com" },
              { icon: Clock, title: "Response Times", desc: "Discord: usually under 30 minutes during peak hours, under a few hours overnight. Email: within 24 hours on business days. Premium key activation issues are always prioritized.", contact: null, href: null },
            ].map(({ icon: Icon, title, desc, contact, href }) => (
              <Card key={title} className="p-6 bg-glass">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{desc}</p>
                    {contact && href && (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-primary hover:underline text-sm font-medium">
                        {contact}
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-8 bg-glass mb-8">
            <h2 className="font-heading text-2xl font-bold mb-6">Frequently Asked Support Questions</h2>
            <div className="space-y-6">
              {[
                { q: "My premium key isn't activating — what do I do?", a: "First, make sure you're entering the key on the same device you intend to use (keys are HWID-locked at first activation). If activation still fails, drop a message in #support on Discord with your order email — we'll resync the key in a few minutes." },
                { q: "I bought a premium key but didn't get the email/dashboard entry.", a: "Premium keys are delivered to your dashboard within seconds of PayPal capturing the payment. If your dashboard is empty 60 seconds after payment, refresh once. If it's still empty, contact us with the PayPal transaction ID and we'll manually issue the key." },
                { q: "What payment methods do you accept?", a: "All payments go through PayPal, which means you can pay with PayPal balance, credit cards, debit cards, or bank transfer through PayPal's checkout — even without a PayPal account in most regions." },
                { q: "Can I get a refund?", a: "Premium keys are digital products with instant delivery, so all sales are final. The exception is a key that is provably defective on our side — in that case we replace it. Read the full policy on our Refund Policy page before purchasing." },
                { q: "A script stopped working after a Roblox update.", a: "Roblox updates frequently break scripts. Report the broken script in #script-issues on Discord — most fixes go out within 24–72 hours. Many script authors also release patches that we mirror to the hub automatically." },
                { q: "Which executor should I use with Combo_WICK scripts?", a: "Check the Executors page for our up-to-date recommendations. Compatibility depends on your platform (Windows, macOS, mobile) and how recent your Roblox client is. The page lists UNC scores and recent test dates for each executor." },
                { q: "Do I need to make an account to use the site?", a: "Browsing scripts and reading guides is fully open. You only need an account to save purchase history, manage HWID-bound keys, and use the dashboard. Account creation is free and takes 30 seconds." },
              ].map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-heading text-base font-semibold mb-2">{q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 bg-primary/5 border-primary/30 text-center">
            <h2 className="font-heading text-2xl font-bold mb-4">Need Help Right Now?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              The Combo_WICK Discord is the single fastest way to get a real human on your issue — usually under 30 minutes during peak hours.
            </p>
            <a href="https://discord.com/invite/ufrz9Zaqs8" target="_blank" rel="noopener noreferrer">
              <Button size="lg">Join Combo_WICK Discord</Button>
            </a>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
