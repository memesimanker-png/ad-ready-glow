import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "What are Roblox accounts used for?",
    a: "Roblox accounts can be used for game development testing, creating multiple game servers, building and testing experiences across different account types, or simply having backup accounts. Many developers and content creators need multiple accounts for their workflow.",
  },
  {
    q: "How does the delivery process work?",
    a: "After completing payment through PayPal, your accounts are automatically delivered to your ComboWick dashboard. Simply log in, navigate to your purchases, and you'll find the account credentials ready to use. The entire process typically takes less than 60 seconds.",
  },
  {
    q: "Are these accounts safe and legitimate?",
    a: "Yes. Every account is verified before listing. We ensure all accounts have valid email addresses and working credentials. We recommend changing the password immediately after receiving your accounts for maximum security.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept PayPal, which supports credit cards, debit cards, bank transfers, and PayPal balance. PayPal's buyer protection covers all transactions, giving you peace of mind with every purchase.",
  },
  {
    q: "Do you offer bulk discounts?",
    a: "Yes! Our pricing is structured to reward larger purchases. The 50-account package saves you 8% per account compared to the starter, and the 100-account package saves you 17% per account. For custom bulk orders exceeding 100 accounts, contact us on Discord.",
  },
  {
    q: "What if I have issues with a purchased account?",
    a: "Our support team on Discord is available 24/7. If any account doesn't work as described, we'll replace it or resolve the issue immediately. Customer satisfaction is our top priority.",
  },
  {
    q: "Can I purchase without creating an account?",
    a: "While guest checkout is available, we strongly recommend creating a free ComboWick account. It allows you to access your purchase history, manage credentials, and receive support more efficiently.",
  },
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
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about buying Roblox accounts from ComboWick.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
