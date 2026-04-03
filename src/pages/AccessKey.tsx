import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, User, Clock, Shield, Key } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface StoredKeyData {
  key: string;
  expires_at: string;
  username?: string;
  generated_at: number;
}

export default function AccessKey() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [keyExpiresAt, setKeyExpiresAt] = useState<string | null>(null);
  const [canGenerate, setCanGenerate] = useState(true);

  useEffect(() => {
    // Check all steps completed
    const step3Done = localStorage.getItem("step3_completed");
    if (!step3Done) {
      toast({ variant: "destructive", title: "Access Denied", description: "Please complete all verification steps." });
      navigate("/verify/provider-select");
      return;
    }

    // Load stored key
    try {
      const storedData = localStorage.getItem("hwid_key_data");
      if (storedData) {
        const keyData: StoredKeyData = JSON.parse(storedData);
        const expiryDate = new Date(keyData.generated_at + 24 * 60 * 60 * 1000); // 24 hours
        if (new Date() < expiryDate) {
          setGeneratedKey(keyData.key);
          setKeyExpiresAt(expiryDate.toISOString());
          setUsername(keyData.username || "");
          setCanGenerate(false);
        } else {
          localStorage.removeItem("hwid_key_data");
        }
      }
    } catch {
      localStorage.removeItem("hwid_key_data");
    }
  }, [navigate, toast]);

  useEffect(() => {
    if (keyExpiresAt) {
      const interval = setInterval(() => {
        if (new Date() >= new Date(keyExpiresAt)) {
          setCanGenerate(true);
          setGeneratedKey("");
          setKeyExpiresAt(null);
          localStorage.removeItem("hwid_key_data");
          toast({ title: "Key Expired", description: "Your access key has expired. Generate a new one." });
        }
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [keyExpiresAt, toast]);

  const generateKey = () => {
    if (!canGenerate) return;

    // Generate a client-side key
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const segments = Array.from({ length: 4 }, () =>
      Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    );
    const key = `CW-${segments.join("-")}`;

    const now = Date.now();
    const expiryDate = new Date(now + 24 * 60 * 60 * 1000);

    const keyData: StoredKeyData = {
      key,
      expires_at: expiryDate.toISOString(),
      username: username.trim() || undefined,
      generated_at: now,
    };

    localStorage.setItem("hwid_key_data", JSON.stringify(keyData));
    setGeneratedKey(key);
    setKeyExpiresAt(expiryDate.toISOString());
    setCanGenerate(false);

    toast({ title: "Key Generated!", description: "Your access key has been generated successfully." });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Key copied to clipboard." });
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to copy to clipboard." });
    }
  };

  const formatTimeRemaining = () => {
    if (!keyExpiresAt) return "";
    const remaining = new Date(keyExpiresAt).getTime() - Date.now();
    if (remaining <= 0) return "Expired";
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-[url('/images/hacker-background.jpg')] bg-cover bg-center bg-fixed flex flex-col">
      <div className="min-h-screen bg-black/70 flex flex-col">
        <header className="container py-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">COMBO WICK</h1>
          </div>
        </header>

        <main className="flex-1 container flex flex-col items-center justify-center py-12">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Key className="h-12 w-12 text-primary mx-auto" />
              <h1 className="text-3xl font-bold">Access Key Generator</h1>
              <p className="text-muted-foreground">Generate your free access key below.</p>
            </div>

            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle>Generate Your Key</CardTitle>
                <CardDescription>Enter a username (optional) and generate your key.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Username (optional)</label>
                  </div>
                  <Input
                    placeholder="Enter your Roblox username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={!canGenerate}
                  />
                </div>

                {generatedKey ? (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-black/50 p-4 border border-green-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-green-400 font-medium">Your Access Key:</span>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generatedKey)} className="h-7 text-green-400 hover:text-green-300">
                          <Copy className="h-3 w-3 mr-1" /> Copy
                        </Button>
                      </div>
                      <code className="text-lg font-mono text-green-500 break-all select-all">{generatedKey}</code>
                    </div>

                    {keyExpiresAt && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Expires in: {formatTimeRemaining()}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button onClick={generateKey} disabled={!canGenerate} className="w-full bg-gradient-to-r from-primary to-purple-500 hover:shadow-lg transition-all">
                    <Key className="mr-2 h-4 w-4" />
                    Generate Access Key
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
