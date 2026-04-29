import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useIsAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Plus, Save, Trash2, Edit, Key, Users, Code, Eye, EyeOff, Copy, UserCheck, Mail, MailOpen, MailX, Bell } from "lucide-react";
import { useAllScripts } from "@/hooks/useScripts";
import { CATEGORIES } from "@/lib/scripts-data";
import { Navigate, Link } from "react-router-dom";

const DEFAULT_SCRIPT_CODE = `loadstring(game:HttpGet('https://raw.githubusercontent.com/checkurasshole/Script/refs/heads/main/IQ'))();`;

const emptyScript = {
  title: "", slug: "", description: "", longDescription: "",
  game: "", category: "Utility", tags: [] as string[],
  code: DEFAULT_SCRIPT_CODE, faqs: [] as { question: string; answer: string }[],
  trending: false, verified: true, gameUniverseId: "" as string,
  youtube_url: "" as string, is_paid: false, gameUrl: "" as string,
};

export default function Admin() {
  const { isAdmin, loading, user } = useIsAdmin();
  const { toast } = useToast();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-bold font-heading">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin privileges.</p>
          <Link to="/"><Button variant="outline">Go Home</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold font-heading">Admin Dashboard</h1>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>

        <Tabs defaultValue="scripts" className="space-y-6">
          <TabsList className="bg-secondary/50 flex-wrap h-auto">
            <TabsTrigger value="scripts" className="gap-2"><Code className="h-4 w-4" /> Scripts</TabsTrigger>
            <TabsTrigger value="orders" className="gap-2"><Key className="h-4 w-4" /> Orders</TabsTrigger>
            <TabsTrigger value="generate" className="gap-2"><Plus className="h-4 w-4" /> Generate Key</TabsTrigger>
            <TabsTrigger value="accounts" className="gap-2"><UserCheck className="h-4 w-4" /> Accounts</TabsTrigger>
            <TabsTrigger value="messages" className="gap-2"><Mail className="h-4 w-4" /> Messages</TabsTrigger>
            <TabsTrigger value="users" className="gap-2"><Users className="h-4 w-4" /> Users</TabsTrigger>
          </TabsList>

          <TabsContent value="scripts"><ScriptsTab /></TabsContent>
          <TabsContent value="orders"><OrdersTab /></TabsContent>
          <TabsContent value="generate"><GenerateKeyTab /></TabsContent>
          <TabsContent value="accounts"><AccountsTab /></TabsContent>
          <TabsContent value="messages"><MessagesTab /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
}

/* ─── Generate Key Tab ─── */
function GenerateKeyTab() {
  const { toast } = useToast();
  const [tier, setTier] = useState("trial-7day");
  const [email, setEmail] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<{ key: string; expires_at: string; tier: string } | null>(null);

  const inputCls = "w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedKey(null);
    try {
      const { data, error } = await supabase.functions.invoke("admin-generate-key", {
        body: { tier, customer_email: email.trim() || undefined },
      });
      if (error) throw error;
      if (data?.success) {
        setGeneratedKey(data);
        toast({ title: "Key Generated!", description: `${data.tier} key created successfully.` });
      } else {
        toast({ variant: "destructive", title: "Error", description: data?.error || "Failed to generate key" });
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setGenerating(false);
    }
  };

  const copyKey = () => {
    if (generatedKey?.key) {
      navigator.clipboard.writeText(generatedKey.key);
      toast({ title: "Copied!", description: "Key copied to clipboard." });
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-lg font-semibold">Generate Premium Key</h2>
      <Card className="p-6 space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Tier *</label>
          <select value={tier} onChange={e => setTier(e.target.value)} className={inputCls}>
            <option value="trial-7day">3-Day Trial ($5)</option>
            <option value="monthly">Monthly Access ($9.99)</option>
            <option value="lifetime">Lifetime Key ($49.99)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Customer Email (optional)</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="customer@example.com" />
        </div>
        <Button onClick={handleGenerate} disabled={generating} className="w-full">
          {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
          Generate Key
        </Button>

        {generatedKey && (
          <div className="mt-4 p-4 rounded-lg border border-green-500/30 bg-green-500/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-400">Generated Key:</span>
              <Button size="sm" variant="ghost" onClick={copyKey} className="text-green-400 hover:text-green-300">
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
            <code className="block text-sm font-mono text-green-500 break-all select-all">{generatedKey.key}</code>
            <p className="text-xs text-muted-foreground">Tier: {generatedKey.tier} • Expires: {new Date(generatedKey.expires_at).toLocaleDateString()}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ─── Scripts Tab ─── */
function ScriptsTab() {
  const { data: scripts = [], refetch } = useAllScripts();
  const [form, setForm] = useState({ ...emptyScript });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const aiAutofill = async () => {
    if (!form.code.trim()) { toast({ title: "Paste script code first", variant: "destructive" }); return; }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-script-autofill", {
        body: {
          code: form.code,
          existing: {
            title: form.title || undefined,
            slug: form.slug || undefined,
            description: form.description || undefined,
            longDescription: form.longDescription || undefined,
            game: form.game || undefined,
            category: form.category && form.category !== "Utility" ? form.category : undefined,
            tags: form.tags.length ? form.tags : undefined,
          },
        },
      });
      if (error) throw error;
      const filled: string[] = [];
      setForm(prev => {
        const next = { ...prev };
        if (!prev.title && data.title) { next.title = data.title; filled.push("title"); }
        if (!prev.slug && data.slug) { next.slug = data.slug; filled.push("slug"); }
        if (!prev.description && data.description) { next.description = data.description; filled.push("description"); }
        if (!prev.longDescription && data.longDescription) { next.longDescription = data.longDescription; filled.push("long description"); }
        if (!prev.game && data.game) { next.game = data.game; filled.push("game"); }
        if ((!prev.category || prev.category === "Utility") && data.category) { next.category = data.category; filled.push("category"); }
        if (!prev.tags.length && data.tags?.length) { next.tags = data.tags; filled.push("tags"); }
        if (!prev.faqs.length && data.faqs?.length) { next.faqs = data.faqs; filled.push("faqs"); }
        return next;
      });
      toast({
        title: filled.length ? `AI filled: ${filled.join(", ")}` : "All fields already filled — manual input preserved",
      });
    } catch (e: any) { toast({ title: "AI autofill failed", description: e.message, variant: "destructive" }); }
    finally { setAiLoading(false); }
  };

  const save = async () => {
    if (!form.title || !form.slug || !form.code || !form.game || !form.category) {
      toast({ title: "Fill required fields", variant: "destructive" }); return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title, slug: form.slug, description: form.description,
        long_description: form.longDescription, game: form.game, category: form.category,
        tags: form.tags, code: form.code, faqs: form.faqs as any,
        trending: form.trending, verified: form.verified,
        game_universe_id: form.gameUniverseId ? Number(form.gameUniverseId) : null,
        youtube_url: form.youtube_url || null,
        is_paid: form.is_paid,
        game_url: form.gameUrl || null,
      };
      if (editingId) {
        const { error } = await supabase.from("scripts").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Script updated" });
      } else {
        const { error } = await supabase.from("scripts").insert(payload);
        if (error) throw error;
        toast({ title: "Script saved" });
      }
      setForm({ ...emptyScript });
      setEditingId(null);
      setShowForm(false);
      refetch();
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const deleteScript = async (id: string) => {
    if (!confirm("Delete this script?")) return;
    const { error } = await supabase.from("scripts").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); refetch(); }
  };

  const editScript = (s: any) => {
    setForm({
      title: s.title, slug: s.slug, description: s.description,
      longDescription: s.long_description || "", game: s.game, category: s.category,
      tags: s.tags || [], code: s.code, faqs: s.faqs || [],
      trending: !!s.trending, verified: !!s.verified,
      gameUniverseId: s.game_universe_id ? String(s.game_universe_id) : "",
      youtube_url: s.youtube_url || "",
      is_paid: !!s.is_paid,
      gameUrl: s.game_url || "",
    });
    setEditingId(s.id);
    setShowForm(true);
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      set("tags", [...form.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const inputCls = "w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{scripts.length} Scripts</h2>
        <Button onClick={() => { setForm({ ...emptyScript }); setEditingId(null); setShowForm(!showForm); }}>
          <Plus className="h-4 w-4 mr-2" /> {showForm ? "Close Form" : "Add Script"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">{editingId ? "Edit Script" : "New Script"}</h3>
          <div>
            <label className="text-sm font-medium mb-1 block">Script Code *</label>
            <textarea value={form.code} onChange={e => set("code", e.target.value)} rows={5} className={`${inputCls} font-mono text-xs`} placeholder="Paste Lua code..." />
          </div>
          <Button onClick={aiAutofill} disabled={aiLoading} variant="outline" className="w-full">
            {aiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            AI Auto-Fill
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium mb-1 block">Title *</label><input value={form.title} onChange={e => set("title", e.target.value)} className={inputCls} /></div>
            <div><label className="text-sm font-medium mb-1 block">Slug *</label><input value={form.slug} onChange={e => set("slug", e.target.value)} className={inputCls} /></div>
            <div><label className="text-sm font-medium mb-1 block">Game *</label><input value={form.game} onChange={e => set("game", e.target.value)} className={inputCls} placeholder="e.g. Prison Life" /></div>
            <div><label className="text-sm font-medium mb-1 block">Game Universe ID</label><input value={form.gameUniverseId} onChange={e => set("gameUniverseId", e.target.value)} className={inputCls} placeholder="Roblox Universe ID for thumbnail" /></div>
            <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">🎮 Roblox Game URL (for Play Game button)</label><input value={form.gameUrl} onChange={e => set("gameUrl", e.target.value)} className={inputCls} placeholder="https://www.roblox.com/games/123456789/Game-Name" /></div>
            <div><label className="text-sm font-medium mb-1 block">Category *</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className={inputCls}>
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div><label className="text-sm font-medium mb-1 block">Short Description</label><input value={form.description} onChange={e => set("description", e.target.value)} className={inputCls} /></div>
          <div><label className="text-sm font-medium mb-1 block">Long Description</label><textarea value={form.longDescription} onChange={e => set("longDescription", e.target.value)} rows={3} className={inputCls} /></div>
          <div>
            <label className="text-sm font-medium mb-1 block">🎬 YouTube Video URL (optional)</label>
            <input
              value={form.youtube_url}
              onChange={e => set("youtube_url", e.target.value)}
              className={inputCls}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-[11px] text-muted-foreground mt-1">Embed a tutorial video on the script detail page.</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Tags</label>
            <div className="flex gap-2 mb-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} className={`${inputCls} flex-1`} placeholder="Add tag..." />
              <Button onClick={addTag} size="sm" variant="outline"><Plus className="h-3 w-3" /></Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-destructive/20 hover:text-destructive" onClick={() => set("tags", form.tags.filter(x => x !== t))}>#{t} ×</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.trending} onChange={e => set("trending", e.target.checked)} className="rounded" /> Trending</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.verified} onChange={e => set("verified", e.target.checked)} className="rounded" /> Verified</label>
            <label className="flex items-center gap-2 text-sm font-semibold text-yellow-400"><input type="checkbox" checked={form.is_paid} onChange={e => set("is_paid", e.target.checked)} className="rounded" /> 💰 Paid Script</label>
          </div>
          <Button onClick={save} disabled={saving} className="w-full">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {editingId ? "Update Script" : "Save Script"}
          </Button>
        </Card>
      )}

      <div className="space-y-2">
        {scripts.map(s => (
          <Card key={s.id} className="p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{s.title}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">{s.category}</span>
                {s.trending && <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">🔥</span>}
              </div>
              <p className="text-xs text-muted-foreground truncate">{s.game} • {s.slug}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                title="Notify all subscribers about this script"
                onClick={async () => {
                  if (!confirm(`Send an in-app notification to all signed-up users about "${s.title}"?`)) return;
                  const { data, error } = await supabase.rpc("broadcast_notification", {
                    _title: `New script: ${s.title}`,
                    _body: s.description?.slice(0, 140) || `Check out the new ${s.game} script.`,
                    _link: `/scripts/${s.slug}`,
                    _type: "script",
                  });
                  if (error) {
                    toast({ variant: "destructive", title: "Failed", description: error.message });
                  } else {
                    toast({ title: "Notified!", description: `Sent to ${data} users.` });
                  }
                }}
              >
                <Bell className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => editScript(s)}><Edit className="h-3 w-3" /></Button>
              <Button size="sm" variant="destructive" onClick={() => deleteScript(s.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─── Orders Tab ─── */
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("premium_key_purchases").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setOrders(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{orders.length} Orders</h2>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No orders yet</p>
      ) : (
        <div className="space-y-2">
          {orders.map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{o.tier}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${o.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{o.status}</span>
                    {o.payment_id?.startsWith("ADMIN-") && (
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">Admin Generated</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{o.customer_email || "No email"} • ${o.amount} {o.currency}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Order ID:</span>
                    <code className="text-[11px] font-mono bg-secondary px-1.5 py-0.5 rounded break-all">{o.payment_id}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(o.payment_id)}
                      className="text-muted-foreground hover:text-foreground text-[10px] underline"
                      title="Copy order ID"
                    >copy</button>
                  </div>
                </div>
                <div className="text-right">
                  <KeyDisplay value={o.key_generated} />
                  <p className="text-xs text-muted-foreground mt-1">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function KeyDisplay({ value }: { value: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center gap-1">
      <code className="text-xs font-mono bg-secondary px-2 py-1 rounded">{show ? value : "••••••••"}</code>
      <button onClick={() => setShow(!show)} className="text-muted-foreground hover:text-foreground">
        {show ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      </button>
    </div>
  );
}

/* ─── Users Tab ─── */
function UsersTab() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setProfiles(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{profiles.length} Users</h2>
      {profiles.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No users yet</p>
      ) : (
        <div className="space-y-2">
          {profiles.map(p => (
            <Card key={p.id} className="p-4 flex items-center justify-between">
              <div>
                <span className="font-medium text-sm">{p.display_name || "Unknown"}</span>
                <p className="text-xs text-muted-foreground">ID: {p.user_id?.slice(0, 8)}...</p>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Accounts Tab (read-only inventory) ─── */
function AccountsTab() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "available" | "claimed">("all");
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("roblox_accounts")
        .select("id, username, password, package_size, claimed, claimed_at, claimed_by, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        toast({ title: "Failed to load accounts", description: error.message, variant: "destructive" });
      } else {
        setAccounts(data || []);
      }
      setLoading(false);
    })();
  }, [toast]);

  const filtered = accounts.filter(a =>
    filter === "all" ? true : filter === "available" ? !a.claimed : a.claimed
  );

  const totalAvailable = accounts.filter(a => !a.claimed).length;
  const totalClaimed = accounts.filter(a => a.claimed).length;

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied` });
  };

  const exportTxt = () => {
    const lines = filtered.map(a => `${a.username}:${a.password}  (size:${a.package_size}, ${a.claimed ? "CLAIMED" : "AVAILABLE"})`);
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `roblox-accounts-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4"><p className="text-xs text-muted-foreground">Total</p><p className="text-2xl font-bold">{accounts.length}</p></Card>
        <Card className="p-4 border-success/30"><p className="text-xs text-muted-foreground">Available</p><p className="text-2xl font-bold text-success">{totalAvailable}</p></Card>
        <Card className="p-4 border-muted"><p className="text-xs text-muted-foreground">Claimed</p><p className="text-2xl font-bold text-muted-foreground">{totalClaimed}</p></Card>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-2">
          {(["all", "available", "claimed"] as const).map(f => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={exportTxt} disabled={!filtered.length}>
          <Copy className="h-4 w-4 mr-2" /> Export {filtered.length} as .txt
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <UserCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No accounts in this view.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(a => {
            const revealed = revealedIds.has(a.id);
            return (
              <Card key={a.id} className="p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-semibold">{a.username}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${a.claimed ? "bg-muted text-muted-foreground" : "bg-success/15 text-success"}`}>
                        {a.claimed ? "CLAIMED" : "AVAILABLE"}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">size {a.package_size}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground select-all">
                        {revealed ? a.password : "•".repeat(Math.min(a.password.length, 12))}
                      </span>
                      <button onClick={() => toggleReveal(a.id)} className="text-muted-foreground hover:text-foreground">
                        {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    {a.claimed && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Claimed {new Date(a.claimed_at).toLocaleString()} by {a.claimed_by?.slice(0, 8)}…
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => copy(a.username, "Username")}><Copy className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => copy(a.password, "Password")}><Key className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center pt-4">
        Read-only view — accounts page is removed from the public site. Manage inventory via Discord / direct database access.
      </p>
    </div>
  );
}

/* ─── Messages Tab (Contact form inbox) ─── */
function MessagesTab() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "archived">("all");
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    setLoading(false);
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
      return;
    }
    setMessages(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const sendReply = async (id: string) => {
    const text = (replyDraft[id] ?? "").trim();
    if (!text) {
      toast({ title: "Empty reply", description: "Type a reply first.", variant: "destructive" });
      return;
    }
    setSavingId(id);
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("contact_messages").update({
      admin_reply: text,
      replied_at: new Date().toISOString(),
      replied_by: userData?.user?.id ?? null,
      status: "read",
    }).eq("id", id);
    setSavingId(null);
    if (error) {
      toast({ title: "Reply failed", description: error.message, variant: "destructive" });
      return;
    }
    setMessages(prev => prev.map(m => m.id === id ? { ...m, admin_reply: text, replied_at: new Date().toISOString(), status: "read" } : m));
    setReplyDraft(prev => { const { [id]: _, ...rest } = prev; return rest; });
    toast({ title: "Reply saved", description: "User will see it in their dashboard." });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setMessages(prev => prev.filter(m => m.id !== id));
    toast({ title: "Deleted" });
  };

  const filtered = filter === "all" ? messages : messages.filter(m => m.status === filter);
  const counts = {
    all: messages.length,
    new: messages.filter(m => m.status === "new").length,
    read: messages.filter(m => m.status === "read").length,
    archived: messages.filter(m => m.status === "archived").length,
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold">Contact Form Inbox</h2>
        <div className="flex gap-2 text-xs">
          {(["all", "new", "read", "archived"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:text-foreground"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No messages in this view.</Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(m => (
            <Card key={m.id} className={`p-4 ${m.status === "new" ? "border-primary/40" : ""}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold">{m.subject}</h3>
                    {m.status === "new" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">New</span>}
                    {m.admin_reply && <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/20 text-success uppercase tracking-wider">Replied</span>}
                    {m.status === "archived" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">Archived</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    From <strong className="text-foreground">{m.name}</strong> &lt;{m.email}&gt; •{" "}
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm whitespace-pre-wrap break-words text-foreground/90">{m.message}</p>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  {m.status !== "archived" && (
                    <Button size="sm" variant="ghost" onClick={() => setStatus(m.id, "archived")}>
                      <MailX className="h-3.5 w-3.5 mr-1" /> Archive
                    </Button>
                  )}
                  {m.status === "new" && (
                    <Button size="sm" variant="ghost" onClick={() => setStatus(m.id, "read")}>
                      <MailOpen className="h-3.5 w-3.5 mr-1" /> Mark read
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => remove(m.id)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>

              {/* Reply thread */}
              {m.admin_reply ? (
                <div className="mt-3 rounded-lg border border-success/30 bg-success/5 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-success mb-1">
                    Your reply • {m.replied_at ? new Date(m.replied_at).toLocaleString() : ""}
                  </p>
                  <p className="text-sm whitespace-pre-wrap break-words text-foreground/90">{m.admin_reply}</p>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <textarea
                    className="w-full min-h-[80px] text-sm rounded-md border border-border bg-background p-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Write a reply — the user will see it in their dashboard…"
                    value={replyDraft[m.id] ?? ""}
                    onChange={(e) => setReplyDraft(prev => ({ ...prev, [m.id]: e.target.value }))}
                    maxLength={4000}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" disabled={savingId === m.id} onClick={() => sendReply(m.id)}>
                      {savingId === m.id ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Mail className="h-3.5 w-3.5 mr-1" />}
                      Send reply
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`, "_blank")}>
                      Or open email client
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
