import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState, FormEvent } from "react";
import { Loader2, Shield, UserPlus, UserCheck, Trash2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { createAdminUser } from "@/fns/create-admin-user";
import { formatAuthError, getAccessToken } from "@/lib/supabase-auth";

export const Route = createFileRoute("/admin/admins")({
  component: AdminUsersPage,
});

type AdminRow = { user_id: string; email: string; created_at: string };

function AdminUsersPage() {
  const createAdminFn = useServerFn(createAdminUser);
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState("");

  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [creating, setCreating] = useState(false);

  const [grantEmail, setGrantEmail] = useState("");
  const [granting, setGranting] = useState(false);

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    setMsg("");
    const { data, error } = await supabase.rpc("list_admins");
    if (error) {
      setMsg(
        error.message.includes("Could not find the function")
          ? "Database migration required: run the latest Supabase migrations (list_admins)."
          : error.message,
      );
      setAdmins([]);
    } else {
      setAdmins((data as AdminRow[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadAdmins();
  }, [loadAdmins]);

  async function onCreateAdmin(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setMsg("");
    setOk("");
    try {
      const accessToken = await getAccessToken();
      const result = await createAdminFn({
        data: {
          accessToken,
          email: createEmail.trim(),
          password: createPassword,
        },
      });
      setOk(`Admin account created for ${result.email}. They can sign in immediately.`);
      setCreateEmail("");
      setCreatePassword("");
      await loadAdmins();
    } catch (err) {
      setMsg(formatAuthError(err));
    } finally {
      setCreating(false);
    }
  }

  async function onGrantAdmin(e: FormEvent) {
    e.preventDefault();
    setGranting(true);
    setMsg("");
    setOk("");
    const { error } = await supabase.rpc("grant_admin_by_email", {
      target_email: grantEmail.trim(),
    });
    setGranting(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    setOk(`Admin access granted to ${grantEmail.trim()}.`);
    setGrantEmail("");
    await loadAdmins();
  }

  async function onRevoke(userId: string, email: string) {
    if (!confirm(`Remove admin access for ${email}?`)) return;
    setMsg("");
    setOk("");
    const { error } = await supabase.rpc("revoke_admin", { target_user_id: userId });
    if (error) {
      setMsg(error.message);
      return;
    }
    setOk(`Removed admin access for ${email}.`);
    await loadAdmins();
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl">Admin Users</h1>
          <p className="text-sm text-muted-foreground">Create accounts or grant admin access</p>
        </div>
      </div>

      {msg && <div className="mb-4 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{msg}</div>}
      {ok && (
        <div className="mb-4 text-sm text-green-800 bg-green-100 dark:bg-green-950 dark:text-green-200 p-3 rounded-lg">
          {ok}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" /> Create new admin
          </h2>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Creates a login and grants admin access immediately. Requires SUPABASE_SERVICE_ROLE_KEY on the server.
          </p>
          <form onSubmit={onCreateAdmin} className="space-y-3">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground py-2.5 rounded-full text-sm font-semibold disabled:opacity-60"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create admin account
            </button>
          </form>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-primary" /> Grant admin to existing user
          </h2>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            User must already have signed up on the login page first.
          </p>
          <form onSubmit={onGrantAdmin} className="space-y-3">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
                placeholder="user@example.com"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={granting}
              className="w-full inline-flex items-center justify-center gap-2 border-2 border-primary text-primary py-2.5 rounded-full text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-smooth disabled:opacity-60"
            >
              {granting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Grant admin access
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-card border border-border">
        <h2 className="font-semibold mb-4">Current admins</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : admins.length === 0 ? (
          <p className="text-sm text-muted-foreground">No admins listed yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {admins.map((a) => (
              <li key={a.user_id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{a.email}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate">{a.user_id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRevoke(a.user_id, a.email)}
                  className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}