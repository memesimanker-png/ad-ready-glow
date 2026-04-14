import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Script } from "@/lib/scripts-data";

function mapRow(row: any): Script {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    longDescription: row.long_description || "",
    game: row.game,
    category: row.category,
    tags: row.tags || [],
    createdAt: row.created_at?.split("T")[0] || "",
    updatedAt: row.updated_at?.split("T")[0] || "",
    trending: row.trending || false,
    verified: row.verified || false,
    code: row.code,
    faqs: (row.faqs as any[]) || [],
  };
}

export function useAllScripts() {
  return useQuery({
    queryKey: ["scripts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scripts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    },
  });
}

export function useScriptBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["scripts", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("scripts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data ? mapRow(data) : null;
    },
    enabled: !!slug,
  });
}

export function useSearchScripts(query: string, category: string) {
  return useQuery({
    queryKey: ["scripts", "search", query, category],
    queryFn: async () => {
      let q = supabase.from("scripts").select("*");
      if (category && category !== "All") q = q.eq("category", category);
      if (query) q = q.or(`title.ilike.%${query}%,game.ilike.%${query}%,description.ilike.%${query}%`);
      const { data, error } = await q.order("updated_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
    },
  });
}

export function useRelatedScripts(scriptId: string, game: string, category: string) {
  return useQuery({
    queryKey: ["scripts", "related", scriptId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scripts")
        .select("*")
        .neq("id", scriptId)
        .or(`game.eq.${game},category.eq.${category}`)
        .limit(3);
      if (error) throw error;
      return (data || []).map(mapRow);
    },
    enabled: !!scriptId,
  });
}
