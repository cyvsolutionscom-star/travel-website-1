import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { z } from "zod";
import { MessageCircle, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink, bookingMessage } from "@/lib/whatsapp";

const searchSchema = z.object({
  vehicle: z.string().optional().catch(""),
});

export const Route = createFileRoute("/book")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Book Your Ride — MNM Travels" },
      { name: "description", content: "Quick booking form. Reserve a sedan, SUV or tempo traveller in minutes." },
    ],
  }),
  component: BookPage,
});

const formSchema = z.object({
  customer_name: z.string().trim().min(1, "Name required").max(100),
  phone: z.string().trim().min(8, "Valid phone required").max(15),
  email: z.string().trim().email().optional().or(z.literal("")),
  vehicle_name: z.string().min(1, "Select a vehicle").max(100),
  pickup_location: z.string().trim().min(1, "Pickup required").max(200),
  drop_location: z.string().trim().max(200).optional(),
  travel_date: z.string().min(1, "Date required"),
  return_date: z.string().optional(),
  payment_method: z.string().optional(),
  notes: z.string().max(500).optional(),
});

function BookPage() {
  const { vehicle } = Route.useSearch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    vehicle_name: vehicle ?? "",
    pickup_location: "",
    drop_location: "",
    travel_date: "",
    return_date: "",
    payment_method: "upi",
    notes: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = formSchema.safeParse(form);
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
      return_date: parsed.data.return_date || null,
      payment_method: parsed.data.payment_method || null,
      notes: parsed.data.notes || null,
      status: "new",
    });
    setSubmitting(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setDone(true);
    // open whatsapp in new tab
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
        <h1 className="font-display text-3xl">Booking Received!</h1>
        <p className="mt-3 text-muted-foreground">We've also opened WhatsApp so you can confirm with us instantly. Our team will reach out shortly.</p>
        <div className="mt-8 flex gap-3 justify-center">
          <button onClick={() => navigate({ to: "/" })} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold">Back Home</button>
          <button onClick={() => navigate({ to: "/payment" })} className="px-5 py-2.5 rounded-full bg-gradient-gold text-secondary-foreground font-semibold shadow-gold">View Payment Options</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <span className="text-secondary font-bold text-sm uppercase tracking-widest">Book a Ride</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Reserve Your Vehicle</h1>
        <p className="mt-3 text-muted-foreground">Fill in the details and our team will confirm via WhatsApp.</p>

        <form onSubmit={onSubmit} className="mt-8 grid sm:grid-cols-2 gap-4 p-6 md:p-8 rounded-2xl bg-card border border-border shadow-card">
          <Field label="Full Name *" value={form.customer_name} onChange={(v) => update("customer_name", v)} />
          <Field label="Phone *" value={form.phone} onChange={(v) => update("phone", v)} type="tel" />
          <Field label="Email" value={form.email} onChange={(v) => update("email", v)} type="email" className="sm:col-span-2" />
          <Field label="Vehicle *" value={form.vehicle_name} onChange={(v) => update("vehicle_name", v)} placeholder="e.g. Toyota Innova" className="sm:col-span-2" />
          <Field label="Pickup Location *" value={form.pickup_location} onChange={(v) => update("pickup_location", v)} />
          <Field label="Drop Location" value={form.drop_location} onChange={(v) => update("drop_location", v)} />
          <Field label="Travel Date *" value={form.travel_date} onChange={(v) => update("travel_date", v)} type="date" />
          <Field label="Return Date" value={form.return_date} onChange={(v) => update("return_date", v)} type="date" />
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Payment Method</label>
            <select value={form.payment_method} onChange={(e) => update("payment_method", e.target.value)} className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm">
              <option value="upi">UPI</option>
              <option value="qr">Scan QR Code</option>
              <option value="cod">Cash on Delivery (COD)</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Notes</label>
            <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3} className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm" />
          </div>

          {error && <div className="sm:col-span-2 text-destructive text-sm">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground px-6 py-3.5 rounded-full font-bold shadow-elegant hover:scale-[1.02] transition-smooth disabled:opacity-60"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><MessageCircle className="w-4 h-4" /> Submit & Send via WhatsApp</>}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, className = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
