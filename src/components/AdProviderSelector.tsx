import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ExternalLink, ShoppingCart } from "lucide-react";

interface AdProvider {
  id: string;
  name: string;
  description: string;
  disabled?: boolean;
}

interface AdProviderSelectorProps {
  providers: AdProvider[];
  onSelect: (providerId: string) => void;
  selectedProvider?: string;
}

export function AdProviderSelector({ providers, onSelect, selectedProvider }: AdProviderSelectorProps) {
  const [selected, setSelected] = useState<string>(selectedProvider || "linkvertise");

  const handleSelect = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId);
    if (provider?.disabled) return;
    setSelected(providerId);
  };

  const handleContinue = () => {
    if (selected) onSelect(selected);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Ad Provider</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selected} onValueChange={handleSelect} className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.id} className="space-y-3">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value={provider.id} id={provider.id} disabled={provider.disabled} />
                <Label htmlFor={provider.id} className={`text-base font-medium ${provider.disabled ? "text-muted-foreground" : ""}`}>
                  {provider.id === "linkvertise" ? "Free Key (Linkvertise)" : provider.name}
                </Label>
              </div>
              {selected === provider.id && (
                <div className="pl-6">
                  <Button
                    onClick={handleContinue}
                    className="w-full relative overflow-hidden group bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                  >
                    Continue with {provider.id === "linkvertise" ? "Free Key" : provider.name}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </RadioGroup>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3 font-medium">Looking for something else?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="/premium-keys"
              className="group relative bg-purple-600 hover:bg-purple-500 rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] text-left overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-md bg-purple-700 flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xs">Request Script/Buy Keys</h3>
                </div>
                <div className="flex items-center gap-1 text-purple-200 text-xs font-semibold">
                  Premium Keys <ExternalLink size={10} />
                </div>
              </div>
            </a>
            <a
              href="/scripts"
              className="group relative bg-green-600 hover:bg-green-500 rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] text-left overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-md bg-green-700 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-xs">See All Scripts</h3>
                </div>
                <div className="flex items-center gap-1 text-green-200 text-xs font-semibold">
                  Browse Scripts <ExternalLink size={10} />
                </div>
              </div>
            </a>
          </div>

          {/* Linkvertise wait-time disclaimer */}
          <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed border border-border/40 rounded-md p-3 bg-muted/20">
            <span className="font-semibold text-foreground">Heads up:</span> Linkvertise sets the wait timers (including the ~1 hour cooldown) on their end — <span className="font-semibold text-foreground">we don't control them</span>. They use those timers to pay creators per verification. Want to skip ad-walls completely? Grab a <a href="/premium-keys" className="text-primary underline underline-offset-2 hover:no-underline">Premium Key</a>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
