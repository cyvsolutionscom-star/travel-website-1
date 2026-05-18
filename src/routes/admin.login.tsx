import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, FormEvent, useEffect } from "react";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  checkSupabaseConnection,
  formatAuthError,
  getSupabaseConfigError,
  type SupabaseConnectionStatus,
} from "@/lib/supabase-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Login — MNM Travels" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [connection, setConnection] = useState<SupabaseConnectionStatus | null>(null);
  const [checkingConnection, setCheckingConnection] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      setCheckingConnection(true);
      const configError = getSupabaseConfigError();
      if (configError) {
        if (mounted) {
          setMsg(configError);
          setConnection({ ok: false, message: configError });
          setCheckingConnection(false);
        }
        return;
      }

      const status = await checkSupabaseConnection();
      if (!mounted) return;
      setConnection(status);
      setCheckingConnection(false);
      if (!status.ok) {
        setMsg(status.message);
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) navigate({ to: "/admin" });
      } catch (err) {
        setMsg(formatAuthError(err));
      }
    }

    void init();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const configError = getSupabaseConfigError();
    if (configError) {
      setLoading(false);
      return setMsg(configError);
    }

    const conn = await checkSupabaseConnection();
    if (!conn.ok) {
      setConnection(conn);
      setLoading(false);
      return setMsg(conn.message);
    }

    try {
      if (mode === "signup") {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (signUpError) {
          setLoading(false);
          return setMsg(signUpError.message);
        }
        setLoading(false);
        if (signUpData.session) navigate({ to: "/admin" });
        else {
          setMsg(
            "Account created. If email confirmation is enabled, check your inbox. The first account automatically receives admin access.",
          );
        }
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      setLoading(false);
      if (error) return setMsg(error.message);
      navigate({ to: "/admin" });
    } catch (err) {
      setLoading(false);
      setMsg(formatAuthError(err));
    }
  }

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-16">
      <div className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-elegant">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center shadow-elegant">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl">Admin Portal</h1>
            <p className="text-xs text-muted-foreground">MNM Travels Dashboard</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm" />
          </div>
          {checkingConnection && (
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking Supabase connection…
            </p>
          )}
          {!checkingConnection && connection?.ok && (
            <p className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 p-2 rounded-lg">
              Supabase connected{connection.projectHost ? ` (${connection.projectHost})` : ""}.
            </p>
          )}
          {msg && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{msg}</div>}
          <button
            type="submit"
            disabled={loading || checkingConnection || connection?.ok === false}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground py-3 rounded-full font-bold shadow-elegant hover:scale-[1.02] transition-smooth disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {mode === "login" ? "Sign In" : "Create Admin Account"}
          </button>
        </form>

        {mode === "login" && (
          <>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">First time?</span></div>
            </div>
            <button
              type="button"
              onClick={() => { setMode("signup"); setMsg(""); }}
              className="w-full inline-flex items-center justify-center gap-2 border-2 border-primary text-primary py-3 rounded-full font-bold hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              Create Admin Account
            </button>
            <p className="mt-2 text-[11px] text-center text-muted-foreground">Create an account, then copy your user ID from the access screen to grant admin access.</p>
          </>
        )}

        {mode === "signup" && (
          <button onClick={() => { setMode("login"); setMsg(""); }} className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground">
            Already have an account? Sign in
          </button>
        )}
        <Link to="/" className="block text-center mt-6 text-xs text-muted-foreground hover:text-foreground">← Back to site</Link>
      </div>
    </div>
  );
}
