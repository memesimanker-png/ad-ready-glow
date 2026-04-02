import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Code, Shield, Gamepad2, Key, ArrowRight } from "lucide-react";

const guides = [
  { title: "Getting Started with COMBO WICK", description: "Learn how to generate your first free key, install a compatible executor, and run your first script in under 5 minutes.", icon: Key, link: "/keys" },
  { title: "Lua Scripting Tutorials", description: "Master the fundamentals of Lua programming — variables, functions, loops, tables, and object-oriented patterns used in Roblox game development.", icon: Code, link: "/tutorials" },
  { title: "Executor Compatibility Guide", description: "Find the best executor for your device. Compare UNC scores, features, and platform support across 30+ executors.", icon: Gamepad2, link: "/executors" },
  { title: "Understanding Anti-Cheat Systems", description: "Learn how anti-cheat detection works in online games, including server-side validation and client-server architecture.", icon: Shield, link: "/anti-cheat-guide" },
  { title: "System Documentation", description: "Technical documentation for the COMBO WICK key system — how verification works, API integration, and security measures.", icon: BookOpen, link: "/docs" },
  { title: "Account Safety Best Practices", description: "Protect your Roblox account with 2FA, alt accounts for testing, strong passwords, and recognizing phishing attempts.", icon: Shield, link: "/tutorials" },
];

export default function Guides() {
  return (
    <Layout>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <header className="text-center space-y-4 mb-12">
            <h1 className="font-heading text-4xl font-bold">Guides & Resources</h1>
            <p className="text-xl text-muted-foreground">Everything you need to get started and make the most of COMBO WICK</p>
          </header>

          <div className="grid gap-6">
            {guides.map((guide) => (
              <Card key={guide.title} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <guide.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-lg mb-1">{guide.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{guide.description}</p>
                      <Link to={guide.link}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 px-0">
                          Read Guide <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
