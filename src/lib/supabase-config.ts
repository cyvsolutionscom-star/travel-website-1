/** Public Supabase settings (anon key is safe in the browser). */
export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

declare global {
  interface Window {
    __SUPABASE_CONFIG__?: SupabasePublicConfig;
  }
}

/** Build-time (Vite) + runtime (injected in HTML on deploy). */
export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const runtime = typeof window !== "undefined" ? window.__SUPABASE_CONFIG__ : undefined;
  const url =
    runtime?.url ||
    import.meta.env.VITE_SUPABASE_URL ||
    (typeof process !== "undefined" ? process.env.SUPABASE_URL : undefined);
  const anonKey =
    runtime?.anonKey ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    (typeof process !== "undefined" ? process.env.SUPABASE_PUBLISHABLE_KEY : undefined);

  if (!url || !anonKey) return null;
  return { url: url.replace(/\/$/, ""), anonKey };
}

export function getSupabaseConfigError(): string | null {
  if (getSupabasePublicConfig()) return null;
  return "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel (or .env locally), then redeploy.";
}
