import { supabase } from "@/integrations/supabase/client";

export function getSupabaseConfigError(): string | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your hosting environment (e.g. Vercel), then redeploy.";
  }
  return null;
}

export function formatAuthError(error: unknown): string {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";

  if (
    error instanceof TypeError ||
    message === "Failed to fetch" ||
    message.includes("NetworkError") ||
    message.includes("fetch failed")
  ) {
    return "Could not reach Supabase. Check your internet connection, confirm the Supabase project exists, and verify VITE_SUPABASE_URL is correct in environment variables.";
  }

  if (message) return message;
  return "Something went wrong. Please try again.";
}

export async function getAccessToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  const token = data.session?.access_token;
  if (!token) throw new Error("Not signed in.");
  return token;
}
