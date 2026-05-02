import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Car, TrendingUp, Clock, Plus, Settings, Image, BarChart3, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ total: 0, today: 0, vehicles: 0, pending: 0 });
  const [recent, setRecent] = useState<Array<{ id: string; customer_name: string; vehicle_name: string | null; travel_date: string; status: string; created_at: string }>>([]);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
      const [{ count: total }, { count: todayCount }, { count: vehicles }, { count: pending }, { data: rec }, { data: weekBookings }] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }).gte("created_at", today),
        supabase.from("vehicles").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("bookings").select("id,customer_name,vehicle_name,travel_date,status,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("bookings").select("created_at").gte("created_at", weekAgo),
      ]);
      setStats({ total: total ?? 0, today: todayCount ?? 0, vehicles: vehicles ?? 0, pending: pending ?? 0 });
      setRecent(rec ?? []);

      // Build 7-day chart data
      const days = Array(7).fill(0);
      (weekBookings ?? []).forEach((b) => {
        const d = Math.floor((Date.now() - new Date(b.created_at).getTime()) / 86400000);
        if (d >= 0 && d < 7) days[6 - d]++;
      });
      setWeeklyData(days);
    })();
  }, []);

  const cards = [
    { icon: Calendar, label: "Total Bookings", value: stats.total, color: "from-blue-500 to-blue-600" },
    { icon: Clock, label: "Pending", value: stats.pending, color: "from-amber-500 to-orange-500" },
    { icon: TrendingUp, label: "Today", value: stats.today, color: "from-emerald-500 to-green-600" },
    { icon: Car, label: "Vehicles", value: stats.vehicles, color: "from-purple-500 to-fuchsia-500" },
  ];

  const quickActions = [
    { icon: Plus, label: "Add Vehicle", to: "/admin/vehicles" as const },
    { icon: Calendar, label: "View Bookings", to: "/admin/bookings" as const },
    { icon: Settings, label: "Site Settings", to: "/admin/settings" as const },
  ];

  const maxBar = Math.max(...weeklyData, 1);

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-display text-3xl">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back, here's what's happening.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        {quickActions.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
          >
            <a.icon className="w-4 h-4" /> {a.label} <ArrowUpRight className="w-3 h-3" />
          </Link>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="p-5 rounded-2xl bg-card border border-border shadow-card">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} text-white grid place-items-center shadow-card mb-3`}>
              <c.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-bold font-display">{c.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Recent */}
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        {/* Mini bar chart */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg">Bookings — Last 7 Days</h2>
          </div>
          <div className="flex items-end gap-2 h-32">
            {weeklyData.map((v, i) => {
              const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              const dayName = dayLabels[d.getDay() === 0 ? 6 : d.getDay() - 1];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary/60 transition-all"
                    style={{ height: `${Math.max((v / maxBar) * 100, 4)}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{dayName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-xs text-primary font-semibold hover:underline">View All →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="font-medium text-sm">{b.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{b.vehicle_name ?? "—"} · {b.travel_date}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.status === "new" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" : "bg-muted text-muted-foreground"}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
