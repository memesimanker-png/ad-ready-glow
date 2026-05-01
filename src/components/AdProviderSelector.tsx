import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";


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
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Note:</span> Linkvertise sets the wait timers on their end — we don't control them. Prefer to skip the wait? Visit our <a href="/premium-keys" className="text-primary underline underline-offset-2 hover:no-underline">Premium Keys</a> page.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
