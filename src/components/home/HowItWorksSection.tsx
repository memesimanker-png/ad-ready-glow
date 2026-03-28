export function HowItWorksSection() {
  const steps = [
    { step: "1", title: "Choose Your Package", desc: "Select from our Starter, Popular, or Pro packages based on how many verified accounts you need." },
    { step: "2", title: "Complete Payment", desc: "Pay securely through PayPal. We accept credit cards, debit cards, and PayPal balance. All transactions are protected." },
    { step: "3", title: "Access Your Accounts", desc: "Credentials are delivered instantly to your dashboard. Log in, copy your account details, and start using them right away." },
  ];

  return (
    <section className="py-20 sm:py-24 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Getting your verified Roblox accounts is simple. Three steps and you're ready to go.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                <span className="font-heading text-xl font-bold text-primary">{item.step}</span>
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
