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
      .then(({ data }) => {
        if (!active) return;
        if (data?.value) setValue(data.value as T);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [key]);

  return { value, loading };
}