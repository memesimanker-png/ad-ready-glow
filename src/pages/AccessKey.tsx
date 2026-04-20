import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, User, Clock, Shield, Key, MousePointerClick, Loader2 } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { loadMonetagPopunder } from "@/lib/monetag-popunder";

interface StoredKeyData {
  key: string;
  expires_at: string;
  username?: string;
  generated_at: number;
}

const DIRECT_LINK_URL = "https://omg10.com/4/10877293";

export default function AccessKey() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [keyExpiresAt, setKeyExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canGenerate, setCanGenerate] = useState(true);
  const [directLinkClicks, setDirectLinkClicks] = useState(0);
  const [directLinkCompleted, setDirectLinkCompleted] = useState(false);
  const [showDirectLinkGate, setShowDirectLinkGate] = useState(true);
  const [error, setError] = useState("");

  // Fire popunder at most once every 5 minutes (shared across pages)
  useEffect(() => {
    loadMonetagPopunder();
  }, []);

  // Verify steps are completed & load stored key
  useEffect(() => {
    const step3Done = localStorage.getItem("step3_completed");
    if (!step3Done) {
      toast({ variant: "destructive", title: "Access Denied", description: "Please complete all verification steps." });
      navigate("/verify/provider-select");
      return;
    }

    loadStoredKeyData();
    checkExistingKey();
  }, [navigate, toast]);

  const loadStoredKeyData = () => {
    try {
      const storedData = localStorage.getItem("hwid_key_data");
      if (storedData) {
        const keyData: StoredKeyData = JSON.parse(storedData);
        const expiryDate = new Date(keyData.generated_at + 10 * 60 * 1000); // 10 minutes
        if (new Date() < expiryDate) {
          setGeneratedKey(keyData.key);
          setKeyExpiresAt(expiryDate.toISOString());
          setUsername(keyData.username || "");
          setCanGenerate(false);
          setShowDirectLinkGate(false);
          setDirectLinkCompleted(true);
        } else {
          localStorage.removeItem("hwid_key_data");
        }
      }
    } catch {
      localStorage.removeItem("hwid_key_data");
    }
  };

  const checkExistingKey = async () => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("check-hwid-key-status", {
        body: {},
      });

      if (fnError) {
        console.error("Error checking existing key:", fnError);
        return;
      }

      if (data?.success && data?.hasActiveKey) {
        const now = Date.now();
        const expiryDate = new Date(now + 10 * 60 * 1000);

        const keyData: StoredKeyData = {
          key: data.key || "",
          expires_at: expiryDate.toISOString(),
          username: data.username,
          generated_at: now,
        };

        localStorage.setItem("hwid_key_data", JSON.stringify(keyData));
        setGeneratedKey(data.key || "");
        setKeyExpiresAt(expiryDate.toISOString());
        setCanGenerate(false);
        setShowDirectLinkGate(false);
        setDirectLinkCompleted(true);
      }
    } catch (err) {
      console.error("Error checking existing key:", err);
    }
  };

  // Expiry watcher
  useEffect(() => {
    if (keyExpiresAt) {
      const interval = setInterval(() => {
        if (new Date() >= new Date(keyExpiresAt)) {
          setCanGenerate(true);
          setGeneratedKey("");
          setKeyExpiresAt(null);
          localStorage.removeItem("hwid_key_data");
          toast({ title: "Key Expired", description: "Your access key has expired. Please verify again to generate a new key." });
          navigate("/verify/provider-select");
        }
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [keyExpiresAt, toast, navigate]);

  const handleDirectLinkClick = () => {
    const newClicks = directLinkClicks + 1;
    setDirectLinkClicks(newClicks);
    window.open(DIRECT_LINK_URL, "_blank");

    if (newClicks >= 2) {
      setDirectLinkCompleted(true);
      setTimeout(() => setShowDirectLinkGate(false), 1000);
      toast({ title: "Gate Completed!", description: "You can now access the key generator." });
    }
  };

  const generateKey = async () => {
    if (!canGenerate || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-hwid-key", {
        body: { username: username.trim() || undefined },
      });

      if (fnError) {
        setError("Failed to generate key. Please try again.");
        toast({ variant: "destructive", title: "Error", description: "Failed to generate key." });
        setIsLoading(false);
        return;
      }

      if (data?.success) {
        const now = Date.now();
        const expiryDate = new Date(now + 10 * 60 * 1000); // 10 minutes display timer

        const keyData: StoredKeyData = {
          key: data.key,
          expires_at: expiryDate.toISOString(),
          username: data.username || username.trim(),
          generated_at: now,
        };

        localStorage.setItem("hwid_key_data", JSON.stringify(keyData));
        setGeneratedKey(data.key);
        setKeyExpiresAt(expiryDate.toISOString());
        setCanGenerate(false);

        toast({ title: "Key Generated!", description: `Your ${data.hours || 11}-hour HWID key has been generated.` });
      } else {
        setError(data?.error || "Failed to generate key");
        toast({ variant: "destructive", title: "Error", description: data?.error || "Failed to generate key." });
      }
    } catch (err) {
      console.error("Network error in generateKey:", err);
      setError("Network error occurred");
      toast({ variant: "destructive", title: "Error", description: "Network error occurred." });
    } finally {
      setIsLoading(false);
    }
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

  // Direct link gate
  if (showDirectLinkGate && !directLinkCompleted) {
    return (
      <div className="min-h-screen bg-black/70 flex items-center justify-center p-4">
        <div className="space-y-4 w-full max-w-md">
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointerClick className="h-5 w-5 text-primary" />
                One More Step!
              </CardTitle>
              <CardDescription>Click the button below 2 times to access the key generator</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleDirectLinkClick}
                className="w-full bg-gradient-to-r from-primary via-purple-500 to-primary hover:shadow-lg transition-all"
              >
                <MousePointerClick className="mr-2 h-4 w-4" />
                {directLinkClicks >= 2 ? "✓ Completed!" : `Open Link (${directLinkClicks}/2)`}
              </Button>
              <p className="text-xs text-muted-foreground text-center">Progress: {directLinkClicks}/2 clicks completed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/70 flex flex-col">
      <header className="container py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">COMBO WICK</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 container flex flex-col items-center justify-center py-12">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Key className="h-12 w-12 text-primary mx-auto" />
            <h1 className="text-3xl font-bold">Access Key Generator</h1>
            <p className="text-muted-foreground">Generate your HWID access key below.</p>
          </div>

          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle>Generate Your Key</CardTitle>
              <CardDescription>Enter a username (optional) and generate your 11-hour HWID key.</CardDescription>
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
                  disabled={!canGenerate || isLoading}
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              {generatedKey ? (
                <div className="space-y-3">
                  <div className="rounded-lg bg-black/50 p-4 border border-green-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-green-400 font-medium">Your HWID Key:</span>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generatedKey)} className="h-7 text-green-400 hover:text-green-300">
                        <Copy className="h-3 w-3 mr-1" /> Copy
                      </Button>
                    </div>
                    <code className="text-lg font-mono text-green-500 break-all select-all">{generatedKey}</code>
                  </div>
                  {keyExpiresAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Display expires in: {formatTimeRemaining()}</span>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={generateKey}
                  disabled={!canGenerate || isLoading}
                  className="w-full bg-gradient-to-r from-primary to-purple-500 hover:shadow-lg transition-all"
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Key className="mr-2 h-4 w-4" /> Generate HWID Key</>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
