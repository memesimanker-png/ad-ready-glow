import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Shield, Zap, Check, ChevronDown, ChevronUp,
  Lock, HeadphonesIcon, Award, TrendingUp, BookOpen, ArrowRight
} from "lucide-react";
import { useState } from "react";
import { PricingSection } from "@/components/home/PricingSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FAQSection } from "@/components/home/FAQSection";
import { BlogPreviewSection } from "@/components/home/BlogPreviewSection";

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/warrior-bg.png')] bg-cover bg-center opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold text-success uppercase tracking-wider">Available Now • Instant Delivery</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Premium Verified{" "}
            <span className="text-gradient-primary">Roblox Accounts</span>{" "}
            Delivered Instantly
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Get verified Roblox accounts starting at just $0.20 per account with secure PayPal payments and automated instant delivery. Trusted by our growing community of gamers and developers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing">
              <Button size="lg" className="text-base px-8 py-6">
                View Packages
              </Button>
            </a>
            <Link to="/about">
              <Button variant="outline" size="lg" className="text-base px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <PricingSection />
      <HowItWorksSection />
      <BlogPreviewSection />
      <FAQSection />

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Create your account today and get instant access to verified Roblox accounts at competitive prices. Secure payments, instant delivery, and dedicated support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pricing">
              <Button size="lg" className="text-base px-8 py-6">Browse Packages</Button>
            </a>
            <Link to="/blog">
              <Button variant="outline" size="lg" className="text-base px-8 py-6">Read Our Guides</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
