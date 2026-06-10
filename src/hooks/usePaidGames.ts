import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PaidGameSetting {
  hidden: boolean;
  paused: boolean;
  pause_message: string | null;
}

// Returns settings for paid-game keys (hidden / paused / pause message).
export function usePaidGameSettings() {
  return useQuery({
    queryKey: ["paid-script-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paid_script_settings")
        .select("game_key, hidden, paused, pause_message");
      if (error) throw error;
      const map = new Map<string, PaidGameSetting>();
      (data || []).forEach((r: any) => {
        map.set(r.game_key, {
          hidden: !!r.hidden,
          paused: !!r.paused,
          pause_message: r.pause_message ?? null,
        });
      });
      return map;
    },
    staleTime: 60_000,
  });
}

// Back-compat: set of hidden paid-game keys.
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
