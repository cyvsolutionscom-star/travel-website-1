/**
 * Injects Supabase URL + anon key at runtime from server env (fixes Vercel when VITE_* was missing at build).
 */
export function SupabaseRuntimeConfig() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const anonKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";

  if (!url || !anonKey) return null;

  const payload = JSON.stringify({ url: url.replace(/\/$/, ""), anonKey });
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__SUPABASE_CONFIG__=${payload};`,
      }}
    />
  );
}
