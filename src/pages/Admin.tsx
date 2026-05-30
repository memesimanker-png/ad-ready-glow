import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useIsAdmin, useIsSuperAdmin, useAdminTabs, ALL_ADMIN_TABS, type AdminTab } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Plus, Save, Trash2, Edit, Key, Users, Code, Eye, EyeOff, Copy, UserCheck, Mail, MailOpen, MailX, Bell, ShieldCheck, ShieldAlert, MessageSquare, Upload, ImageIcon, X } from "lucide-react";
import { useAllScripts } from "@/hooks/useScripts";
import { CATEGORIES } from "@/lib/scripts-data";
import { Navigate, Link } from "react-router-dom";
import { DiscordPostDialog } from "@/components/DiscordPostDialog";
import { compressImage } from "@/lib/image-compress";

const DEFAULT_SCRIPT_CODE = `loadstring(game:HttpGet('https://raw.githubusercontent.com/checkurasshole/Script/refs/heads/main/IQ'))();`;
const LOADER_API_BASE = "https://vcuwjyjkbtxccywzeadu.supabase.co/functions/v1/public-api/repos/checkurasshole/Loaders/files";

const getLoaderFileName = (game: string) => game
  .replace(/[^a-zA-Z0-9 ]/g, "")
  .split(/\s+/)
  .filter(Boolean)
  .map(w => w.charAt(0).toUpperCase() + w.slice(1))
  .join("");

const getLoaderCode = (fileName: string) => `loadstring(game:HttpGet('https://raw.githubusercontent.com/checkurasshole/Loaders/refs/heads/main/${fileName}'))();`;

const emptyScript = {
  title: "", slug: "", description: "", longDescription: "",
  game: "", category: "Utility", tags: [] as string[],
  code: DEFAULT_SCRIPT_CODE, faqs: [] as { question: string; answer: string }[],
  trending: false, verified: true, gameUniverseId: "" as string,
  youtube_url: "" as string, is_paid: false, gameUrl: "" as string,
  thumbnail_url: "" as string,
};

export default function Admin() {
  const { isAdmin, loading, user } = useIsAdmin();
  const { isSuperAdmin } = useIsSuperAdmin();
  const { tabs: allowedTabs, loading: tabsLoading } = useAdminTabs();
  const { toast } = useToast();
  const can = (t: AdminTab) => isSuperAdmin || allowedTabs.includes(t);

  if (loading || tabsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const defaultTab = (allowedTabs[0] as string) || "scripts";

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
          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Super Admin
              </span>
            )}
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="bg-secondary/50 flex-wrap h-auto">
            {can("scripts") && <TabsTrigger value="scripts" className="gap-2" title="Manage all scripts (create, edit, delete, send notifications)"><Code className="h-4 w-4" /> Scripts</TabsTrigger>}
            {can("scripts") && <TabsTrigger value="paid-scripts" className="gap-2" title="Show or hide paid game scripts on the Premium page"><EyeOff className="h-4 w-4" /> Paid Scripts</TabsTrigger>}
            {can("orders") && <TabsTrigger value="orders" className="gap-2" title="View premium key purchase orders and payments"><Key className="h-4 w-4" /> Orders</TabsTrigger>}
            {can("generate") && <TabsTrigger value="generate" className="gap-2" title="Manually generate a premium key for a customer"><Plus className="h-4 w-4" /> Generate Key</TabsTrigger>}
            {can("accounts") && <TabsTrigger value="accounts" className="gap-2" title="Manage legacy private inventory"><UserCheck className="h-4 w-4" /> Inventory</TabsTrigger>}
            {can("messages") && <TabsTrigger value="messages" className="gap-2" title="Read and reply to contact form messages"><Mail className="h-4 w-4" /> Messages</TabsTrigger>}
            {can("users") && <TabsTrigger value="users" className="gap-2" title="View and manage registered user accounts"><Users className="h-4 w-4" /> Users</TabsTrigger>}
            {can("admins") && <TabsTrigger value="admins" className="gap-2" title="Grant or revoke admin/moderator access"><ShieldAlert className="h-4 w-4" /> Admins</TabsTrigger>}
            {isSuperAdmin && <TabsTrigger value="settings" className="gap-2" title="Edit Discord webhook and other site settings"><MessageSquare className="h-4 w-4" /> Settings</TabsTrigger>}
          </TabsList>

          {can("scripts") && <TabsContent value="scripts"><ScriptsTab /></TabsContent>}
          {can("orders") && <TabsContent value="orders"><OrdersTab /></TabsContent>}
          {can("generate") && <TabsContent value="generate"><GenerateKeyTab /></TabsContent>}
          {can("accounts") && <TabsContent value="accounts"><AccountsTab /></TabsContent>}
          {can("messages") && <TabsContent value="messages"><MessagesTab /></TabsContent>}
          {can("users") && <TabsContent value="users"><UsersTab /></TabsContent>}
          {can("admins") && <TabsContent value="admins"><AdminsTab /></TabsContent>}
          {isSuperAdmin && <TabsContent value="settings"><SettingsTab /></TabsContent>}
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
  const [customHours, setCustomHours] = useState<string>("24");
  const [customLabel, setCustomLabel] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("0");

  const inputCls = "w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  const presets = [
    { label: "1 Hour", hours: 1 },
    { label: "6 Hours", hours: 6 },
    { label: "12 Hours", hours: 12 },
    { label: "1 Day", hours: 24 },
    { label: "3 Days", hours: 72 },
    { label: "7 Days", hours: 168 },
    { label: "14 Days", hours: 336 },
    { label: "30 Days", hours: 720 },
    { label: "90 Days", hours: 2160 },
    { label: "1 Year", hours: 8760 },
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedKey(null);
    try {
      const isCustom = tier === "custom";
      const hours = isCustom ? Math.max(1, Math.floor(Number(customHours) || 0)) : undefined;
      if (isCustom && (!hours || hours < 1)) {
        toast({ variant: "destructive", title: "Invalid duration", description: "Enter hours >= 1" });
        setGenerating(false);
        return;
      }
      const { data, error } = await supabase.functions.invoke("admin-generate-key", {
        body: {
          tier,
          customer_email: email.trim() || undefined,
          custom_hours: hours,
          custom_label: isCustom ? (customLabel.trim() || `Custom ${hours}h`) : undefined,
          custom_amount: isCustom ? Number(customAmount) || 0 : undefined,
        },
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
            <option value="custom">⚙ Custom Duration</option>
          </select>
        </div>
        {tier === "custom" && (
          <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <div>
              <label className="text-xs font-medium mb-1 block text-muted-foreground">Quick presets</label>
              <div className="flex flex-wrap gap-1.5">
                {presets.map(p => (
                  <button
                    key={p.hours}
                    type="button"
                    onClick={() => { setCustomHours(String(p.hours)); setCustomLabel(p.label); }}
                    className="px-2.5 py-1 text-xs rounded border border-border bg-secondary/50 hover:bg-primary/20 hover:border-primary/50 transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Duration (hours) *</label>
              <input
                type="number"
                min="1"
                value={customHours}
                onChange={e => setCustomHours(e.target.value)}
                className={inputCls}
                placeholder="e.g. 24 for 1 day, 168 for 7 days"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Examples: 1=1hr, 24=1day, 168=7days, 720=30days, 8760=1year
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Label (optional)</label>
              <input
                value={customLabel}
                onChange={e => setCustomLabel(e.target.value)}
                className={inputCls}
                placeholder="e.g. VIP Weekend Pass"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Amount USD (optional)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                className={inputCls}
                placeholder="0.00"
              />
            </div>
          </div>
        )}
        <div>
          <label className="text-sm font-medium mb-1 block">Customer Email (optional)</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="customer@example.com" />
        </div>
        <Button onClick={handleGenerate} disabled={generating} className="w-full" title="Create a new premium key with the chosen tier and email it to the customer if provided">
          {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
          Generate Key
        </Button>

        {generatedKey && (
          <div className="mt-4 p-4 rounded-lg border border-green-500/30 bg-green-500/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-400">Generated Key:</span>
              <Button size="sm" variant="ghost" onClick={copyKey} className="text-green-400 hover:text-green-300" title="Copy the generated key to clipboard">
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
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [discordTarget, setDiscordTarget] = useState<{ id: string; title: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const { toast } = useToast();

  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const handleThumbnailUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please choose an image file", variant: "destructive" });
      return;
    }
    setUploadingThumb(true);
    try {
      const compressed = await compressImage(file, { maxDim: 800, quality: 0.82 });
      const ext = compressed.name.split(".").pop() || "jpg";
      const path = `${form.slug || "script"}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("script-thumbnails")
        .upload(path, compressed, { cacheControl: "31536000", upsert: false, contentType: compressed.type });
      if (error) throw error;
      const { data } = supabase.storage.from("script-thumbnails").getPublicUrl(path);
      set("thumbnail_url", data.publicUrl);
      const kb = Math.round(compressed.size / 1024);
      const origKb = Math.round(file.size / 1024);
      toast({ title: "Thumbnail uploaded", description: `Compressed ${origKb}KB → ${kb}KB` });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setUploadingThumb(false);
    }
  };

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
      let finalCode = form.code;
      const loaderFileName = getLoaderFileName(form.game);
      if (!editingId && loaderFileName && form.code.trim() === DEFAULT_SCRIPT_CODE) {
        const res = await fetch(`${LOADER_API_BASE}/${loaderFileName}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: DEFAULT_SCRIPT_CODE, message: `Add loader for ${form.game}` }),
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`GitHub loader failed (${res.status}): ${txt.slice(0, 180)}`);
        }
        finalCode = getLoaderCode(loaderFileName);
        toast({ title: `GitHub loader created: ${loaderFileName}` });
      }

      // Auto-build a Roblox URL when admin pastes just a place ID (digits only)
      const rawGameUrl = form.gameUrl.trim();
      const builtGameUrl = /^\d+$/.test(rawGameUrl)
        ? `https://www.roblox.com/games/${rawGameUrl}`
        : (rawGameUrl || null);
      const payload = {
        title: form.title, slug: form.slug, description: form.description,
        long_description: form.longDescription, game: form.game, category: form.category,
        tags: form.tags, code: finalCode, faqs: form.faqs as any,
        trending: form.trending, verified: form.verified,
        game_universe_id: form.gameUniverseId ? Number(form.gameUniverseId) : null,
        youtube_url: form.youtube_url || null,
        is_paid: form.is_paid,
        game_url: builtGameUrl,
        thumbnail_url: form.thumbnail_url || null,
      };
      if (editingId) {
        const { error } = await supabase.from("scripts").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Script updated" });
      } else {
        const { error } = await supabase.from("scripts").insert(payload);
        if (error) throw error;
        toast({ title: "Script saved" });
        // Auto-broadcast in-app notification to every user
        try {
          const { data: count } = await supabase.rpc("broadcast_notification", {
            _title: `New script: ${form.title}`,
            _body: form.description?.slice(0, 140) || `Fresh ${form.game} script just dropped.`,
            _link: `/scripts/${form.slug}`,
            _type: "info",
          });
          toast({ title: `Notified ${count ?? 0} users` });
        } catch (notifyErr: any) {
          toast({ title: "Notify failed", description: notifyErr.message, variant: "destructive" });
        }
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
      thumbnail_url: s.thumbnail_url || "",
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
        <Button onClick={() => { setForm({ ...emptyScript }); setEditingId(null); setShowForm(!showForm); }} title={showForm ? "Close the script editor form" : "Open form to add a brand new script"}>
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
          <Button onClick={aiAutofill} disabled={aiLoading} variant="outline" className="w-full" title="Use AI to auto-generate title, description, tags, and FAQs from the pasted code">
            {aiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            AI Auto-Fill
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium mb-1 block">Title *</label><input value={form.title} onChange={e => set("title", e.target.value)} className={inputCls} /></div>
            <div><label className="text-sm font-medium mb-1 block">Slug *</label><input value={form.slug} onChange={e => set("slug", e.target.value)} className={inputCls} /></div>
            <div><label className="text-sm font-medium mb-1 block">Game *</label><input value={form.game} onChange={e => set("game", e.target.value)} className={inputCls} placeholder="e.g. Prison Life" /></div>
            <div><label className="text-sm font-medium mb-1 block">Game Universe ID</label><input value={form.gameUniverseId} onChange={e => set("gameUniverseId", e.target.value)} className={inputCls} placeholder="Roblox Universe ID for thumbnail" /></div>
            <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">🎮 Roblox Place ID or full URL <span className="text-muted-foreground font-normal">(auto-builds Play Game link)</span></label><input value={form.gameUrl} onChange={e => set("gameUrl", e.target.value)} className={inputCls} placeholder="e.g. 208050  →  becomes https://www.roblox.com/games/208050" /></div>
            <div><label className="text-sm font-medium mb-1 block">Category *</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className={inputCls}>
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Custom thumbnail upload (overrides Roblox auto-fetch) */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              🖼️ Custom Thumbnail <span className="text-muted-foreground font-normal">(optional — overrides Roblox auto-thumbnail)</span>
            </label>
            <div className="flex items-center gap-3">
              {form.thumbnail_url ? (
                <div className="relative shrink-0">
                  <img src={form.thumbnail_url} alt="Thumbnail preview" className="w-16 h-16 rounded-lg object-cover border border-border" />
                  <button
                    type="button"
                    onClick={() => set("thumbnail_url", "")}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:scale-110 transition-transform"
                    title="Remove custom thumbnail"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center border border-dashed border-border shrink-0">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <label className={`${inputCls} flex-1 flex items-center justify-center gap-2 cursor-pointer hover:bg-secondary/70 transition-colors ${uploadingThumb ? "opacity-50 pointer-events-none" : ""}`}>
                {uploadingThumb ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span>{uploadingThumb ? "Compressing & uploading…" : (form.thumbnail_url ? "Replace image" : "Choose image (auto-compressed)")}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingThumb}
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) handleThumbnailUpload(f);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Any size accepted — automatically resized to max 800px and compressed to keep load fast.
            </p>
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
              <Button onClick={addTag} size="sm" variant="outline" title="Add tag"><Plus className="h-3 w-3" /></Button>
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
          <Button onClick={save} disabled={saving} className="w-full" title={editingId ? "Save changes to this script" : "Publish this script to the public hub"}>
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
                title="🔔 In-app notification only — sends a bell-icon alert to every signed-up user (NOT an email). Bulk marketing emails aren't supported."
                disabled={notifyingId === s.id}
                onClick={async () => {
                  if (notifyingId) return;
                  if (!confirm(`Send an IN-APP notification (🔔 bell icon) to all signed-up users about "${s.title}"?\n\nThis does NOT send an email — bulk marketing emails are not supported.`)) return;
                  setNotifyingId(s.id);
                  try {
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
                  } finally {
                    setNotifyingId(null);
                  }
                }}
              >
                {notifyingId === s.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bell className="h-3 w-3" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                title="📣 Post this script to your Discord webhook (rich embed + optional @everyone / @here / role ping)."
                onClick={() => setDiscordTarget({ id: s.id, title: s.title })}
              >
                <MessageSquare className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => editScript(s)} title="Edit script"><Edit className="h-3 w-3" /></Button>
              <Button size="sm" variant="destructive" onClick={() => deleteScript(s.id)} title="Delete script permanently"><Trash2 className="h-3 w-3" /></Button>
            </div>
          </Card>
        ))}
      </div>
      <DiscordPostDialog
        open={!!discordTarget}
        onOpenChange={(v) => { if (!v) setDiscordTarget(null); }}
        script={discordTarget}
      />
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
      <button onClick={() => setShow(!show)} className="text-muted-foreground hover:text-foreground" title={show ? "Hide value" : "Reveal value"}>
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
    link.download = `legacy-inventory-${Date.now()}.txt`;
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
        <Button variant="outline" size="sm" onClick={exportTxt} disabled={!filtered.length} title="Export all visible accounts as a .txt file (user:pass per line)">
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
                      <button onClick={() => toggleReveal(a.id)} className="text-muted-foreground hover:text-foreground" title={revealed ? "Hide password" : "Show password"}>
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
                    <Button variant="ghost" size="sm" onClick={() => copy(a.username, "Username")} title="Copy username"><Copy className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => copy(a.password, "Password")} title="Copy password"><Key className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center pt-4">
        Read-only private inventory view — removed from the public site.
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
                    <Button size="sm" variant="ghost" onClick={() => setStatus(m.id, "archived")} title="Move this message to the archive (hidden from active list)">
                      <MailX className="h-3.5 w-3.5 mr-1" /> Archive
                    </Button>
                  )}
                  {m.status === "new" && (
                    <Button size="sm" variant="ghost" onClick={() => setStatus(m.id, "read")} title="Mark this message as read">
                      <MailOpen className="h-3.5 w-3.5 mr-1" /> Mark read
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => remove(m.id)} title="Permanently delete this message">
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
                    <Button size="sm" disabled={savingId === m.id} onClick={() => sendReply(m.id)} title="Send your reply — the user will see it in their dashboard and receive an email">
                      {savingId === m.id ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Mail className="h-3.5 w-3.5 mr-1" />}
                      Send reply
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`, "_blank")} title="Open your local email client to reply manually">
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

/* ─── Admins Tab (super_admin only) ─── */
function AdminsTab() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Array<{ user_id: string; role: string; email?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "moderator">("admin");
  const [adding, setAdding] = useState(false);

  const inputCls = "w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["admin", "moderator", "super_admin"]);
    if (error) {
      toast({ variant: "destructive", title: "Failed to load", description: error.message });
      setLoading(false);
      return;
    }
    // Resolve emails (super_admin only via RPC)
    const enriched = await Promise.all((data || []).map(async (r: any) => {
      const { data: emailData } = await supabase.rpc("get_user_email" as any, { _user_id: r.user_id });
      return { ...r, email: (emailData as any) || r.user_id.slice(0, 8) + "…" };
    }));
    setRows(enriched);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const grant = async () => {
    if (!email.trim()) {
      toast({ variant: "destructive", title: "Email required" });
      return;
    }
    setAdding(true);
    const { error } = await supabase.rpc("grant_role_by_email" as any, { _email: email.trim(), _role: role });
    setAdding(false);
    if (error) {
      toast({ variant: "destructive", title: "Failed", description: error.message });
      return;
    }
    toast({ title: "Role granted", description: `${email} is now a ${role}.` });
    setEmail("");
    load();
  };

  const revoke = async (user_id: string, r: string) => {
    if (r === "super_admin") {
      toast({ variant: "destructive", title: "Forbidden", description: "Cannot revoke super_admin from the dashboard." });
      return;
    }
    if (!confirm(`Revoke ${r} role for this user?`)) return;
    const { error } = await supabase.rpc("revoke_user_role" as any, { _user_id: user_id, _role: r });
    if (error) {
      toast({ variant: "destructive", title: "Failed", description: error.message });
      return;
    }
    toast({ title: "Role revoked" });
    load();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="p-5 border-primary/20 bg-primary/5">
        <h2 className="font-semibold mb-1 flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-primary" /> Add an admin or moderator</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Admins added here can manage scripts, accounts, messages, and users — but <strong>cannot view orders / purchases</strong>. Only the super-admin (you) sees those.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="user@example.com"
            className={inputCls}
          />
          <select value={role} onChange={e => setRole(e.target.value as any)} className={inputCls}>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
          <Button onClick={grant} disabled={adding} title="Grant the entered user the selected role (admin or moderator)">
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Grant
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Tip: the user must have already signed up at least once.
        </p>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-3">Current staff ({rows.length})</h2>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : rows.length === 0 ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">No admins or moderators yet.</Card>
        ) : (
          <div className="space-y-2">
            {rows.map((r, i) => (
              <AdminRow
                key={`${r.user_id}-${r.role}-${i}`}
                row={r}
                onRevoke={() => revoke(r.user_id, r.role)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Single admin row with inline permissions editor ─── */
const MANAGEABLE_TABS: Array<{ key: AdminTab; label: string }> = [
  { key: "scripts", label: "Scripts" },
  { key: "orders", label: "Orders" },
  { key: "generate", label: "Generate Key" },
  { key: "accounts", label: "Accounts" },
  { key: "messages", label: "Messages" },
  { key: "users", label: "Users" },
  { key: "admins", label: "Admins" },
];

function AdminRow({ row, onRevoke }: { row: { user_id: string; role: string; email?: string }; onRevoke: () => void }) {
  const { toast } = useToast();
  const [tabs, setTabs] = useState<AdminTab[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const isSuper = row.role === "super_admin";

  const loadTabs = async () => {
    if (loaded || isSuper) return;
    const { data } = await supabase
      .from("admin_permissions" as any)
      .select("tabs")
      .eq("user_id", row.user_id)
      .maybeSingle();
    const t = (data as any)?.tabs as string[] | undefined;
    setTabs((t && t.length ? t : ["scripts", "accounts", "messages", "users"]) as AdminTab[]);
    setLoaded(true);
  };

  const toggle = (t: AdminTab) => {
    setTabs(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.rpc("set_admin_tabs" as any, { _user_id: row.user_id, _tabs: tabs });
    setSaving(false);
    if (error) {
      toast({ variant: "destructive", title: "Failed", description: error.message });
      return;
    }
    toast({ title: "Permissions saved", description: `${row.email} can access ${tabs.length} tab${tabs.length === 1 ? "" : "s"}.` });
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm truncate">{row.email}</span>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              isSuper ? "bg-primary/15 text-primary border-primary/30"
              : row.role === "admin" ? "bg-yellow-500/15 text-yellow-300 border-yellow-500/30"
              : "bg-blue-500/15 text-blue-300 border-blue-500/30"
            }`}>
              {row.role.replace("_", " ")}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{row.user_id.slice(0, 8)}…</p>
        </div>
        <div className="flex items-center gap-2">
          {!isSuper && (
            <Button size="sm" variant="outline" onClick={() => { setExpanded(e => !e); loadTabs(); }} title="Configure which admin sections this user can access">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" /> {expanded ? "Hide" : "Permissions"}
            </Button>
          )}
          {!isSuper && (
            <Button size="sm" variant="destructive" onClick={onRevoke} title="Remove this user's admin access entirely">
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Revoke
            </Button>
          )}
        </div>
      </div>

      {expanded && !isSuper && (
        <div className="border-t border-border pt-3 space-y-3">
          <p className="text-[11px] text-muted-foreground">
            Choose which dashboard tabs <strong>{row.email}</strong> can see.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

            {MANAGEABLE_TABS.map(({ key, label }) => {
              const checked = tabs.includes(key);
              return (
                <label
                  key={key}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-colors ${
                    checked ? "border-primary/50 bg-primary/10 text-foreground" : "border-border bg-secondary/30 text-muted-foreground hover:border-border/80"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(key)}
                    className="accent-primary h-3.5 w-3.5"
                  />
                  {label}
                </label>
              );
            })}
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Save className="h-3.5 w-3.5 mr-1" />}
              Save permissions
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}


/* ─── Settings Tab (Super Admin) ─── */
function SettingsTab() {
  const { toast } = useToast();
  const [webhook, setWebhook] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("app_settings").select("discord_webhook_url").eq("id", 1).maybeSingle();
      if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
      setWebhook(data?.discord_webhook_url || "");
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("app_settings")
      .update({ discord_webhook_url: webhook.trim() || null, updated_at: new Date().toISOString() })
      .eq("id", 1);
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Webhook saved" });
  };

  if (loading) return <Loader2 className="h-6 w-6 animate-spin" />;

  return (
    <Card className="p-6 space-y-4 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold">Discord Webhook</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Used by the "Post to Discord" button. Leaving blank falls back to the env secret.
        </p>
      </div>
      <div className="flex gap-2">
        <input
          type={show ? "text" : "password"}
          value={webhook}
          onChange={(e) => setWebhook(e.target.value)}
          placeholder="https://discord.com/api/webhooks/..."
          className="flex-1 rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <Button variant="outline" size="icon" onClick={() => setShow(!show)} title={show ? "Hide" : "Show"}>
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      <Button onClick={save} disabled={saving} className="w-full">
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Save Webhook
      </Button>
    </Card>
  );
}
