import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/vehicles")({
  component: AdminVehicles,
});

type Vehicle = {
  id: string;
  name: string;
  seater: number;
  daily_rent: number;
  per_km_rate: string | null;
  image_url: string | null;
  description: string | null;
  active: boolean;
  display_order: number;
};

function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("vehicles").select("*").order("display_order");
    setVehicles(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const update = (id: string, patch: Partial<Vehicle>) =>
    setVehicles((vs) => vs.map((v) => (v.id === id ? { ...v, ...patch } : v)));

  const save = async (v: Vehicle) => {
    await supabase.from("vehicles").update({
      name: v.name, seater: v.seater, daily_rent: v.daily_rent,
      per_km_rate: v.per_km_rate, image_url: v.image_url,
      description: v.description, active: v.active, display_order: v.display_order,
    }).eq("id", v.id);
  };

  const add = async () => {
    const { data } = await supabase.from("vehicles").insert({
      name: "New Vehicle", seater: 4, daily_rent: 1000, active: true,
      display_order: (vehicles.at(-1)?.display_order ?? 0) + 1,
    }).select().single();
    if (data) setVehicles([...vehicles, data as Vehicle]);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;
    await supabase.from("vehicles").delete().eq("id", id);
    setVehicles((vs) => vs.filter((v) => v.id !== id));
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl">Vehicles</h1>
          <p className="text-muted-foreground text-sm">{vehicles.length} vehicles in fleet</p>
        </div>
        <button onClick={add} className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold shadow-elegant hover:scale-105 transition-smooth">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      <div className="space-y-4">
        {vehicles.map((v) => (
          <div key={v.id} className="p-5 rounded-2xl bg-card border border-border shadow-card grid md:grid-cols-[120px_1fr_auto] gap-5 items-start">
            <div className="aspect-[4/3] rounded-lg bg-muted overflow-hidden">
              {v.image_url && <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Name" value={v.name} onChange={(x) => update(v.id, { name: x })} />
              <Input label="Image URL" value={v.image_url ?? ""} onChange={(x) => update(v.id, { image_url: x })} />
              <Input label="Seater" type="number" value={String(v.seater)} onChange={(x) => update(v.id, { seater: Number(x) })} />
              <Input label="Daily Rent (₹)" type="number" value={String(v.daily_rent)} onChange={(x) => update(v.id, { daily_rent: Number(x) })} />
              <Input label="Per km rate" value={v.per_km_rate ?? ""} onChange={(x) => update(v.id, { per_km_rate: x })} />
              <Input label="Order" type="number" value={String(v.display_order)} onChange={(x) => update(v.id, { display_order: Number(x) })} />
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <textarea value={v.description ?? ""} onChange={(e) => update(v.id, { description: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" rows={2} />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={v.active} onChange={(e) => update(v.id, { active: e.target.checked })} />
                Active (visible on site)
              </label>
            </div>
            <div className="flex md:flex-col gap-2">
              <button onClick={() => save(v)} className="p-2 rounded-lg bg-success text-success-foreground" title="Save"><Save className="w-4 h-4" /></button>
              <button onClick={() => remove(v.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20" title="Delete"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
    </div>
  );
}
