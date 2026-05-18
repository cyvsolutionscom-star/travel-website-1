import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSiteSetting<T>(key: string, fallback: T): { value: T; loading: boolean } {
  const [value, setValue] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (!error && data?.value) setValue(data.value as T);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [key]);

  return { value, loading };
}