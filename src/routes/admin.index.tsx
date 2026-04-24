import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Car, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ total: 0, today: 0, vehicles: 0, pending: 0 });
  const [recent, setRecent] = useState<Array<{ id: string; customer_name: string; vehicle_name: string | null; travel_date: string; status: string; created_at: string }>>([]);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [{ count: total }, { count: todayCount }, { count: vehicles }, { count: pending }, { data: rec }] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }).gte("created_at", today),
        supabase.from("vehicles").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("bookings").select("id,customer_name,vehicle_name,travel_date,status,created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({ total: total ?? 0, today: todayCount ?? 0, vehicles: vehicles ?? 0, pending: pending ?? 0 });
      setRecent(rec ?? []);
    })();
  }, []);

  const cards = [
    { icon: Calendar, label: "Total Bookings", value: stats.total, color: "from-blue-500 to-blue-600" },
    { icon: Clock, label: "Pending", value: stats.pending, color: "from-amber-500 to-orange-500" },
    { icon: TrendingUp, label: "Today", value: stats.today, color: "from-emerald-500 to-green-600" },
    { icon: Car, label: "Vehicles", value: stats.vehicles, color: "from-purple-500 to-fuchsia-500" },
  ];

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="text-muted-foreground text-sm">Welcome back, here's what's happening.</p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="mt-10 p-6 rounded-2xl bg-card border border-border shadow-card">
        <h2 className="font-display text-xl mb-4">Recent Bookings</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground text-xs uppercase tracking-wider">
                <tr><th className="py-2">Customer</th><th>Vehicle</th><th>Travel Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr key={b.id} className="border-t border-border">
                    <td className="py-3 font-medium">{b.customer_name}</td>
                    <td>{b.vehicle_name ?? "—"}</td>
                    <td>{b.travel_date}</td>
                    <td><span className="px-2 py-0.5 rounded-full bg-muted text-xs">{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
