import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Clock, Youtube, Send, Loader2, CheckCircle2 } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast({ title: "Missing fields", description: "Please fill out every field.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      user_id: userData?.user?.id ?? null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Couldn't send", description: error.message, variant: "destructive" });
      return;
    }
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    toast({ title: "Message sent!", description: "We'll reply on Discord or via email shortly." });
  };

  return (
    <Layout>
      <SEOHead
        title="Contact Combo_WICK — Discord Support, YouTube & Direct Message Form | ComboWick"
        description="Reach the Combo_WICK team. Real-time Discord support, YouTube channel @COMBO_WICK, or send a direct message via our contact form for premium key activation, scripts, and Lua tutorial questions."
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

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: MessageSquare, title: "Discord (Fastest)", desc: "Our 50k+ Discord server replies within minutes during peak hours.", contact: "Join the Discord", href: "https://discord.com/invite/ufrz9Zaqs8" },
              { icon: Youtube, title: "YouTube — @COMBO_WICK", desc: "Script reviews, tutorials, executor showcases, and weekly updates.", contact: "youtube.com/@COMBO_WICK", href: "https://www.youtube.com/@COMBO_WICK" },
              { icon: Clock, title: "Response Times", desc: "Discord under 30 min during peak hours. Form messages within 24h on weekdays. Premium key activation is always prioritized.", contact: null, href: null },
            ].map(({ icon: Icon, title, desc, contact, href }) => (
              <Card key={title} className="p-6 bg-glass">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{desc}</p>
                {contact && href && (
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-primary hover:underline text-sm font-medium">
                    {contact}
                  </a>
                )}
              </Card>
            ))}
          </div>

          {/* Direct message form — saves to admin dashboard */}
          <Card className="p-6 sm:p-8 bg-glass-strong mb-12">
            <h2 className="font-heading text-2xl font-bold mb-2">Send Us a Direct Message</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Prefer not to use Discord? Drop a message here — it lands directly in our admin inbox and we'll get back to you.
            </p>
            {sent ? (
              <div className="flex items-start gap-3 p-4 rounded-lg border border-success/30 bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Message received</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Thanks! We've logged your message. Expect a reply within 24h on weekdays — or hop into Discord for instant help.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setSent(false)}>
                    Send another
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" maxLength={80} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" maxLength={120} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Premium key not activating" maxLength={120} required />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what's going on…" rows={6} maxLength={4000} required />
                  <p className="text-xs text-muted-foreground mt-1">{form.message.length}/4000</p>
                </div>
                <Button type="submit" disabled={submitting} size="lg" className="w-full sm:w-auto">
                  {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Send Message
                </Button>
              </form>
            )}
          </Card>

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
