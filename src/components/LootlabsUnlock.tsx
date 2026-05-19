import { useEffect, useState } from "react";
import { Lock, Loader2, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const UNLOCK_TTL_MS = 24 * 60 * 60 * 1000;
const storageKey = (slug: string) => `lootlabs_unlock_${slug}`;

export function useScriptUnlocked(slug: string | undefined) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const raw = localStorage.getItem(storageKey(slug));
    if (raw) {
      const ts = Number(raw);
      if (Date.now() - ts < UNLOCK_TTL_MS) {
        setUnlocked(true);
        return;
      }
      localStorage.removeItem(storageKey(slug));
    }
  }, [slug]);

  return unlocked;
}

function makeNonce(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface Props {
  slug: string;
  title: string;
  thumbnail?: string | null;
}

export function LootlabsUnlockGate({ slug, title, thumbnail }: Props) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const invokeWithRetry = async (body: any, attempts = 3) => {
    let lastErr: any = null;
    for (let i = 0; i < attempts; i++) {
      try {
        const { data, error } = await supabase.functions.invoke("lootlabs-create-link", { body });
        if (error) throw error;
        const url = (data as any)?.loot_url;
        if (!url) throw new Error("No link returned");
        return url as string;
      } catch (e) {
        lastErr = e;
        // brief backoff before retrying (handles cold-start / transient Lootlabs hiccups)
        await new Promise((r) => setTimeout(r, 400 * (i + 1)));
      }
    }
    throw lastErr ?? new Error("Unlock failed");
  };

  const handleUnlock = async () => {
    setLoading(true);
    try {
      const origin = window.location.origin;
      const nonce = makeNonce();
      localStorage.setItem(
        "lootlabs_pending",
        JSON.stringify({ slug, nonce, ts: Date.now() })
      );
      const destination = `${origin}/ad-return/script-step2?slug=${encodeURIComponent(slug)}&hash=${nonce}`;
      const url = await invokeWithRetry({
        title: `Step 1 ${title}`.slice(0, 30),
        destination,
        thumbnail: thumbnail || undefined,
      });



      window.location.href = url;
    } catch (e: any) {
      toast({ title: "Unlock failed", description: e?.message || "Try again", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
      <Lock className="h-10 w-10 text-primary mx-auto mb-3" />
      <p className="text-lg font-semibold mb-2">Unlock Script Code</p>
      <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
        Complete one quick task to reveal the script. Unlock lasts 24 hours on this device.
      </p>
      <Button onClick={handleUnlock} disabled={loading} size="lg" className="gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
        {loading ? "Generating link..." : "Unlock Script"}
      </Button>
    </div>
  );
}
