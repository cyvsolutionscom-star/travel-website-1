import { createFileRoute, useNavigate, useRouter, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Car, Calendar, Settings, LogOut, Loader2, Copy, Check, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — MNM Travels" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [copied, setCopied] = useState<"id" | "sql" | null>(null);
  const [rechecking, setRechecking] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadAdminState = async (sessionOverride?: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]) => {
      const session = sessionOverride ?? (await supabase.auth.getSession()).data.session;

      if (!mounted) return;

      if (!session) {
        setLoading(false);
        setIsAdmin(false);
        navigate({ to: "/admin/login" });
        return;
      }

      setEmail(session.user.email ?? "");
      setUserId(session.user.id);

      const { data: hasAdminRole, error: roleError } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });

      if (!mounted) return;

      if (roleError) {
        console.error("Role check failed:", roleError);
        setIsAdmin(false);
      } else {
        setIsAdmin(Boolean(hasAdminRole));
      }

      setLoading(false);
    };

    void loadAdminState();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      void loadAdminState(session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out failed:", error);
      }
    } finally {
      setIsAdmin(false);
      setEmail("");
      await router.invalidate();
      navigate({ to: "/admin/login", replace: true });
      setSigningOut(false);
    }
  }

  async function copyToClipboard(text: string, key: "id" | "sql") {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers / insecure contexts
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* noop */ }
      document.body.removeChild(ta);
    }
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
  }

  async function recheckRole() {
    if (rechecking) return;
    setRechecking(true);
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      const { data: hasAdminRole } = await supabase.rpc("has_role", {
        _user_id: session.session.user.id,
        _role: "admin",
      });
      setIsAdmin(Boolean(hasAdminRole));
    }
    setRechecking(false);
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!isAdmin) {
    const sqlSnippet = `INSERT INTO public.user_roles (user_id, role) VALUES ('${userId}', 'admin');`;
    return (
      <div className="min-h-screen grid place-items-center px-4 py-12">
        <div className="w-full max-w-lg p-8 rounded-2xl bg-card border border-border shadow-elegant">
          <h1 className="font-display text-2xl text-center">Access Pending</h1>
          <p className="mt-3 text-center text-muted-foreground text-sm">
            Your account <strong>{email}</strong> is signed in but doesn't have the admin role yet.
          </p>

          <div className="mt-6 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your User ID</label>
            <div className="mt-1.5 flex items-stretch gap-2">
              <code className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-muted text-xs font-mono break-all">{userId}</code>
              <button
                onClick={() => copyToClipboard(userId, "id")}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
              >
                {copied === "id" ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
              </button>
            </div>
          </div>

          <div className="mt-4 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Or run this SQL in the Cloud database</label>
            <div className="mt-1.5 flex items-stretch gap-2">
              <code className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-muted text-[11px] font-mono break-all">{sqlSnippet}</code>
              <button
                onClick={() => copyToClipboard(sqlSnippet, "sql")}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 rounded-lg border border-input bg-background text-xs font-semibold hover:bg-muted"
              >
                {copied === "sql" ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
              </button>
            </div>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            Add this row to <code className="bg-muted px-1.5 py-0.5 rounded">user_roles</code> via the Cloud database, then click <strong>Re-check</strong>.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={recheckRole}
              disabled={rechecking}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-elegant disabled:opacity-60"
            >
              {rechecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Re-check role
            </button>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-input bg-background text-sm font-semibold hover:bg-muted disabled:opacity-60"
            >
              {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />} Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-primary text-primary-foreground flex flex-col">
        <div className="p-5 border-b border-primary-foreground/10">
          <Link to="/" className="font-display text-xl font-bold">
            MNM <span className="text-secondary">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavItem to="/admin" icon={LayoutDashboard} label="Overview" exact />
          <NavItem to="/admin/bookings" icon={Calendar} label="Bookings" />
          <NavItem to="/admin/vehicles" icon={Car} label="Vehicles" />
          <NavItem to="/admin/settings" icon={Settings} label="Settings" />
        </nav>
        <div className="p-3 border-t border-primary-foreground/10">
          <div className="px-3 py-2 text-xs text-primary-foreground/60 truncate">{email}</div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary-foreground/10 disabled:opacity-60"
          >
            {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />} Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-muted/30">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, exact }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string; exact?: boolean }) {
  return (
    <Link
      to={to}
      activeProps={{ className: "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-secondary text-secondary-foreground" }}
      activeOptions={{ exact }}
      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm hover:bg-primary-foreground/10"
    >
      <Icon className="w-4 h-4" /> {label}
    </Link>
  );
}
