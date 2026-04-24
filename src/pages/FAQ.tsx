import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import { SEOHead } from "@/components/SEOHead";

const faqs = [
  { question: "What is COMBO WICK?", answer: "COMBO WICK is a free Roblox script distribution platform that uses time-limited verification keys. Founded in 2023, it serves 50,000+ users with premium executor scripts. The system generates 24-hour access keys through a 3-step ad-verification process. Keys can be regenerated unlimited times at no cost." },
  { question: "How long does key verification take?", answer: "The complete verification process takes 2-5 minutes total across 3 steps: Step 1 requires watching a 15-second YouTube video plus completing verification (~1-2 min). Step 2 involves auto-play video and second verification (~1 min). Step 3 requires 15-second video watch and final verification (~1-2 min)." },
  { question: "How do I get a free key?", answer: "Click 'Begin Verification' on the homepage, then complete the 3-step verification process: Step 1 - Watch our YouTube video and complete the first verification. Step 2 - Complete the second verification step. Step 3 - Complete the final verification and your 24-hour key will be generated automatically." },
  { question: "How long is the access key valid?", answer: "Access keys are valid for 24 hours from the time of generation. After 24 hours, you can regenerate a new key by completing the verification process again. There is no limit to how many times you can generate keys." },
  { question: "Is COMBO WICK safe to use?", answer: "Yes, COMBO WICK uses secure verification methods to protect user data and prevent unauthorized access. Our key system ensures that only verified users can access scripts, and we regularly update our security measures." },
  { question: "Why do I need to complete verification steps?", answer: "The verification process helps us prevent automated bots, protect our scripts from unauthorized distribution, and support our platform. By completing simple steps, you help us continue providing free scripts and updates to the community." },
  { question: "What types of scripts are available?", answer: "COMBO WICK offers a wide range of Roblox scripts including auto-aim, ESP, speed hacks, fly scripts, teleport scripts, auto-farm tools, and many more. We add new scripts daily based on community requests and game updates." },
  { question: "Can I use the same key on multiple devices?", answer: "Yes, your 24-hour key can be used on any device. Simply copy the key and paste it into the executor on any device you want to use. The key remains valid for 24 hours regardless of which device you're using." },
  { question: "What if my key doesn't work?", answer: "If your key isn't working, first check that it hasn't expired (keys are valid for 24 hours). Make sure you're copying the entire key without any extra spaces. If the problem persists, try generating a new key or join our Discord server for support." },
  { question: "Do I need a premium subscription?", answer: "No, COMBO WICK offers completely free access through our verification system. While we offer optional premium features for users who want instant access without verification, the free key system provides full access to all scripts and features." },
  { question: "How often are scripts updated?", answer: "Scripts are updated daily to ensure compatibility with the latest Roblox updates. When Roblox releases patches that break existing scripts, our team works to provide updated versions as quickly as possible." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }), []);

  return (
    <Layout>
      <SEOHead
        title="FAQ — ComboWick | Roblox Scripts, Keys & Executor Questions Answered"
        description="Find answers to common questions about ComboWick's free Roblox scripts, 24-hour key system, premium keys, executors, and how to get started instantly."
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "FAQ", url: "/faq" },
        ]}
        jsonLd={faqJsonLd}
      />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* AI-retrieval paragraph */}
          <header className="text-center space-y-4 mb-12">
            <h1 className="font-heading text-4xl font-bold">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">Find answers to common questions about COMBO WICK</p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              ComboWick is a free Roblox script platform offering 24-hour access keys generated through a 3-step verification process. Premium keys are available for $5 (3-day), $9.99 (monthly), and $49.99 (lifetime). Scripts are updated daily for compatibility with the latest Roblox patches.
            </p>
          </header>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <h3 className="font-semibold">{faq.question}</h3>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
                </button>
                {openIndex === index && (
                  <CardContent className="pt-0 pb-6 px-6">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <a href="https://discord.com/invite/ufrz9Zaqs8" target="_blank" rel="noopener noreferrer">
              <Button>Join Our Discord</Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
