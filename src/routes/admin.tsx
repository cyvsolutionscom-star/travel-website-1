import { createFileRoute, useNavigate, Link, Outlet } from "@tanstack/react-router";
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
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/admin/login" });
    });
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!data.session) {
        navigate({ to: "/admin/login" });
        return;
      }
      setEmail(data.session.user.email ?? "");
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!roleData);
      setLoading(false);
    })();
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

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
          <button onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/admin/login" }))} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            <LogOut className="w-4 h-4" /> Sign Out
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
          <button onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/admin/login" }))} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary-foreground/10">
            <LogOut className="w-4 h-4" /> Sign Out
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
