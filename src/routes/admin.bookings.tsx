import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Phone, MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookings,
});

type Booking = {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  vehicle_name: string | null;
  pickup_location: string;
  drop_location: string | null;
  travel_date: string;
  return_date: string | null;
  payment_method: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

const STATUSES = ["new", "confirmed", "completed", "cancelled"];

function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    setBookings(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    await supabase.from("bookings").delete().eq("id", id);
    setBookings((bs) => bs.filter((b) => b.id !== id));
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl">Bookings</h1>
          <p className="text-muted-foreground text-sm">{bookings.length} total inquiries</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
          <option value="all">All</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No bookings found.</div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((b) => (
            <div key={b.id} className="p-5 rounded-2xl bg-card border border-border shadow-card">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{b.customer_name}</h3>
                    <span className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <strong>{b.vehicle_name ?? "—"}</strong> · {b.pickup_location} {b.drop_location && `→ ${b.drop_location}`}
                  </div>
                  <div className="text-sm mt-1">📅 {b.travel_date}{b.return_date && ` → ${b.return_date}`} · 💳 {b.payment_method ?? "—"}</div>
                  {b.notes && <div className="text-sm text-muted-foreground mt-2 italic">"{b.notes}"</div>}
                </div>
                <div className="flex items-center gap-2">
                  <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)} className="text-xs rounded-md border border-input bg-background px-2 py-1.5">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <a href={`tel:${b.phone}`} className="p-2 rounded-lg bg-primary text-primary-foreground hover:scale-105 transition-smooth" title="Call"><Phone className="w-4 h-4" /></a>
                  <a href={whatsappLink(`Hello ${b.customer_name}, regarding your booking for ${b.vehicle_name ?? ""} on ${b.travel_date}.`)} target="_blank" rel="noopener" className="p-2 rounded-lg bg-success text-success-foreground hover:scale-105 transition-smooth" title="WhatsApp"><MessageCircle className="w-4 h-4" /></a>
                  <button onClick={() => remove(b.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground border-t border-border pt-3">📞 {b.phone}{b.email && ` · ✉️ ${b.email}`}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
