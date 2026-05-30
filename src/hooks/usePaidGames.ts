import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Returns the set of paid-game keys that admins have hidden from the store.
export function useHiddenPaidGames() {
  return useQuery({
    queryKey: ["paid-script-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paid_script_settings")
        .select("game_key, hidden");
      if (error) throw error;
      const hidden = new Set<string>();
      (data || []).forEach((r: any) => { if (r.hidden) hidden.add(r.game_key); });
      return hidden;
    },
    staleTime: 60_000,
  });
}
