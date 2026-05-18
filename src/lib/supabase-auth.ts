import { supabase } from "@/integrations/supabase/client";
import { getSupabaseConfigError, getSupabasePublicConfig } from "@/lib/supabase-config";

export { getSupabaseConfigError };

export type SupabaseConnectionStatus = {
  ok: boolean;
  message: string;
  projectHost?: string;
};

/** Probe Supabase before login — surfaces paused/deleted projects clearly. */
export async function checkSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  const config = getSupabasePublicConfig();
  if (!config) {
    return { ok: false, message: getSupabaseConfigError() ?? "Supabase is not configured." };
  }

  const projectHost = new URL(config.url).hostname;

  try {
    const res = await fetch(`${config.url}/auth/v1/health`, {
      headers: { apikey: config.anonKey },
    });

    if (res.ok) {
      return { ok: true, message: "Connected to Supabase.", projectHost };
    }

    if (res.status === 503 || res.status === 502) {
      return {
        ok: false,
        projectHost,
        message: `Supabase project "${projectHost}" is paused or unavailable. Open supabase.com/dashboard → your project → Restore / Unpause, then try again.`,
      };
    }

    return {
      ok: false,
      projectHost,
      message: `Supabase returned HTTP ${res.status}. Check the project URL in environment variables.`,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (
      message === "Failed to fetch" ||
      message.includes("NetworkError") ||
      message.includes("ERR_NAME_NOT_RESOLVED")
    ) {
      return {
        ok: false,
        projectHost,
        message: `Cannot reach "${projectHost}". The Supabase project may be deleted, paused, or the URL in .env / Vercel is wrong. Create or restore a project at supabase.com and update VITE_SUPABASE_URL.`,
      };
    }
    return { ok: false, projectHost, message: formatAuthError(err) };
  }
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
    const host = getSupabasePublicConfig()?.url
      ? new URL(getSupabasePublicConfig()!.url).hostname
      : "your Supabase host";
    return `Could not reach Supabase (${host}). The project may be paused or deleted — open supabase.com/dashboard, restore the project, and confirm VITE_SUPABASE_URL in Vercel matches Project Settings → API.`;
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
