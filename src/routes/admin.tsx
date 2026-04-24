import { createFileRoute, useNavigate, useRouter, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Car, Calendar, Settings, LogOut, Loader2 } from "lucide-react";
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
  const [signingOut, setSigningOut] = useState(false);

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

  if (loading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="max-w-md text-center p-8 rounded-2xl bg-card border border-border shadow-elegant">
          <h1 className="font-display text-2xl">Access Pending</h1>
          <p className="mt-3 text-muted-foreground text-sm">
            Your account <strong>{email}</strong> is signed in but doesn't have the admin role yet.
          </p>
          <p className="mt-3 text-muted-foreground text-xs">
            To grant admin access, an existing admin must add a row to <code className="bg-muted px-1.5 py-0.5 rounded">user_roles</code> with your user ID and role <code className="bg-muted px-1.5 py-0.5 rounded">admin</code>. The first admin can be added directly via the Cloud database UI.
          </p>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60"
          >
            {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />} Sign Out
          </button>
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
