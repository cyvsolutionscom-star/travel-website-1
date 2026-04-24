import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, FormEvent, useEffect } from "react";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      if (signUpError) {
        setLoading(false);
        return setMsg(signUpError.message);
      }
      // Auto sign-in after signup (auto-confirm is enabled)
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (signInError) return setMsg(signInError.message);
      navigate({ to: "/admin" });
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setMsg(error.message);
    navigate({ to: "/admin" });
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
          {msg && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{msg}</div>}
          <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground py-3 rounded-full font-bold shadow-elegant hover:scale-[1.02] transition-smooth disabled:opacity-60">
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
            <p className="mt-2 text-[11px] text-center text-muted-foreground">The first account created becomes the admin automatically.</p>
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
