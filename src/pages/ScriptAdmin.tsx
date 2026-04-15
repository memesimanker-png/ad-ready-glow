import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/scripts-data";
import { useAllScripts } from "@/hooks/useScripts";

const empty = {
  title: "", slug: "", description: "", longDescription: "",
  game: "", category: "Utility", tags: [] as string[],
  code: "", faqs: [] as { question: string; answer: string }[],
  trending: false, verified: true, is_paid: false,
  youtube_url: "",
};

export default function ScriptAdmin() {
  const [form, setForm] = useState({ ...empty });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const { toast } = useToast();
  const { data: scripts = [], refetch } = useAllScripts();

  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const aiAutofill = async () => {
    if (!form.code.trim()) {
      toast({ title: "Paste script code first", variant: "destructive" });
      return;
    }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-script-autofill", {
        body: { code: form.code },
      });
      if (error) throw error;
      setForm(prev => ({
        ...prev,
        title: data.title || prev.title,
        slug: data.slug || prev.slug,
        description: data.description || prev.description,
        longDescription: data.longDescription || prev.longDescription,
        game: data.game || prev.game,
        category: data.category || prev.category,
        tags: data.tags || prev.tags,
        faqs: data.faqs || prev.faqs,
      }));
      toast({ title: "AI filled fields successfully" });
    } catch (e: any) {
      toast({ title: "AI autofill failed", description: e.message, variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const save = async () => {
    if (!form.title || !form.slug || !form.code || !form.game || !form.category) {
      toast({ title: "Fill required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("scripts").insert({
        title: form.title,
        slug: form.slug,
        description: form.description,
        long_description: form.longDescription,
        game: form.game,
        category: form.category,
        tags: form.tags,
        code: form.code,
        faqs: form.faqs as any,
        trending: form.trending,
        verified: form.verified,
        is_paid: form.is_paid,
        youtube_url: form.youtube_url || null,
      } as any);
      if (error) throw error;
      toast({ title: "Script saved!" });
      setForm({ ...empty });
      refetch();
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      set("tags", [...form.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const inputCls = "w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <Layout>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold font-heading">Script Admin</h1>
          <span className="text-xs text-muted-foreground">{scripts.length} scripts in DB</span>
        </div>

        <div className="space-y-6">
          {/* Code first - for AI autofill */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Script Code *</label>
            <textarea
              value={form.code}
              onChange={e => set("code", e.target.value)}
              rows={6}
              className={`${inputCls} font-mono text-xs`}
              placeholder='loadstring(game:HttpGet("..."))() or paste full Lua code'
            />
          </div>

          <Button onClick={aiAutofill} disabled={aiLoading} variant="outline" className="w-full border-primary/30 hover:bg-primary/10">
            {aiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            AI Auto-Fill All Fields
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title *</label>
              <input value={form.title} onChange={e => set("title", e.target.value)} className={inputCls} placeholder="Blox Fruits Auto Farm V3" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Slug *</label>
              <input value={form.slug} onChange={e => set("slug", e.target.value)} className={inputCls} placeholder="blox-fruits-auto-farm-v3" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Game *</label>
              <input value={form.game} onChange={e => set("game", e.target.value)} className={inputCls} placeholder="Blox Fruits" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Category *</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className={inputCls}>
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Short Description</label>
            <input value={form.description} onChange={e => set("description", e.target.value)} className={inputCls} />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Long Description</label>
            <textarea value={form.longDescription} onChange={e => set("longDescription", e.target.value)} rows={3} className={inputCls} />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">YouTube Video URL</label>
            <input value={form.youtube_url} onChange={e => set("youtube_url", e.target.value)} className={inputCls} placeholder="https://www.youtube.com/watch?v=..." />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Tags</label>
            <div className="flex gap-2 mb-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} className={`${inputCls} flex-1`} placeholder="Add tag..." />
              <Button onClick={addTag} size="sm" variant="outline"><Plus className="h-3 w-3" /></Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-destructive/20 hover:text-destructive" onClick={() => set("tags", form.tags.filter(x => x !== t))}>
                  #{t} ×
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.trending} onChange={e => set("trending", e.target.checked)} className="rounded" />
              Trending
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.verified} onChange={e => set("verified", e.target.checked)} className="rounded" />
              Verified
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-yellow-400">
              <input type="checkbox" checked={form.is_paid} onChange={e => set("is_paid", e.target.checked)} className="rounded" />
              💰 Paid Script
            </label>
          </div>

          <Button onClick={save} disabled={loading} className="w-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Script
          </Button>
        </div>
      </main>
    </Layout>
  );
}
