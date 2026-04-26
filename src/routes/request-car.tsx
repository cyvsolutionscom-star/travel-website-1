import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { bookingMessage, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/request-car")({
  head: () => ({
    meta: [
      { title: "Request a Vehicle — MNM Travels" },
      { name: "description", content: "Tell us what you need and we'll arrange the right vehicle. Fast WhatsApp confirmation." },
      { property: "og:title", content: "Request a Vehicle — MNM Travels" },
      { property: "og:description", content: "Tell us what you need and we'll arrange the right vehicle for your trip." },
    ],
  }),
  component: RequestCarPage,
});

type Vehicle = { id: string; name: string };

const requestSchema = z.object({
  customer_name: z.string().trim().min(1, "Name required").max(100),
  phone: z.string().trim().min(8, "Valid phone required").max(15),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  vehicle_name: z.string().trim().min(1, "Choose a vehicle").max(100),
  pickup_location: z.string().trim().min(1, "Pickup required").max(200),
  drop_location: z.string().trim().max(200).optional(),
  travel_date: z.string().min(1, "Date required"),
  notes: z.string().max(500).optional(),
});

function RequestCarPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    vehicle_name: "",
    pickup_location: "",
    drop_location: "",
    travel_date: "",
    notes: "",
  });

  useEffect(() => {
    supabase
      .from("vehicles")
      .select("id,name")
      .eq("active", true)
      .order("display_order")
      .then(({ data }) => setVehicles(data ?? []));
  }, []);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = requestSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error: dbError } = await supabase.from("bookings").insert({
      customer_name: parsed.data.customer_name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      vehicle_name: parsed.data.vehicle_name,
      pickup_location: parsed.data.pickup_location,
      drop_location: parsed.data.drop_location || null,
      travel_date: parsed.data.travel_date,
      notes: parsed.data.notes || null,
      status: "new",
    });
    setSubmitting(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setDone(true);
    window.open(
      whatsappLink(
        bookingMessage({
          vehicle: form.vehicle_name,
          name: form.customer_name,
          pickup: form.pickup_location,
          drop: form.drop_location,
          date: form.travel_date,
          notes: form.notes,
        })
      ),
      "_blank"
    );
  }

  if (done) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-success/10 grid place-items-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-success" />
        </div>
        <h1 className="font-display text-3xl">Request Sent!</h1>
        <p className="mt-3 text-muted-foreground">We've opened WhatsApp so you can confirm with us instantly. Our team will reach out shortly.</p>
        <Link to="/" className="mt-8 inline-block px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold">Back Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <span className="text-secondary font-bold text-sm uppercase tracking-widest">Request a Vehicle</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Tell us what you need</h1>
        <p className="mt-3 text-muted-foreground">Pick a vehicle, share trip details, and we'll confirm via WhatsApp.</p>

        <form onSubmit={onSubmit} className="mt-8 grid sm:grid-cols-2 gap-4 p-6 md:p-8 rounded-2xl bg-card border border-border shadow-card">
          <Field label="Full Name *" value={form.customer_name} onChange={(v) => update("customer_name", v)} />
          <Field label="Phone *" value={form.phone} onChange={(v) => update("phone", v)} type="tel" />
          <Field label="Email" value={form.email} onChange={(v) => update("email", v)} type="email" className="sm:col-span-2" />

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Vehicle *</label>
            <select
              value={form.vehicle_name}
              onChange={(e) => update("vehicle_name", e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
            >
              <option value="">Select a vehicle…</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
              <option value="Other / Not sure">Other / Not sure</option>
            </select>
          </div>

          <Field label="Pickup Location *" value={form.pickup_location} onChange={(v) => update("pickup_location", v)} />
          <Field label="Drop Location" value={form.drop_location} onChange={(v) => update("drop_location", v)} />
          <Field label="Travel Date *" value={form.travel_date} onChange={(v) => update("travel_date", v)} type="date" className="sm:col-span-2" />

          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              maxLength={500}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
            />
          </div>

          {error && <div className="sm:col-span-2 text-destructive text-sm">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground px-6 py-3.5 rounded-full font-bold shadow-elegant hover:scale-[1.02] transition-smooth disabled:opacity-60"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><MessageCircle className="w-4 h-4" /> Send Request via WhatsApp</>}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}