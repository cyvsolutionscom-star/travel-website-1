import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/ImageUpload";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

type ContactCfg = { phones: string[]; email: string; whatsapp: string; address: string };
type PaymentCfg = { upi_id: string; qr_image: string; cod_enabled: boolean; note: string };
type HeroCfg = { title: string; subtitle: string; tagline: string; images: string[] };
type StatItem = { n: string; l: string };
type ServiceItem = { t: string; d: string };
type LandingCfg = {
  fleet_heading: string;
  fleet_subheading: string;
  services_heading: string;
  services_tagline: string;
  services_intro: string;
  cta_heading: string;
  cta_subheading: string;
  stats: StatItem[];
  services: ServiceItem[];
};

const defaultLanding: LandingCfg = {
  fleet_heading: "Choose your ride",
  fleet_subheading: "These vehicles and prices are managed from the admin dashboard.",
  services_heading: "Our Premium Services",
  services_tagline: "What We Offer",
  services_intro: "Experience the best travel services with MNM Travels — your trusted partner.",
  cta_heading: "Ready to hit the road?",
  cta_subheading: "Book your next journey with MNM Travels and enjoy premium comfort at affordable prices.",
  stats: [
    { n: "10+", l: "Years Experience" },
    { n: "5000+", l: "Happy Customers" },
    { n: "8+", l: "Vehicles Fleet" },
    { n: "100%", l: "Satisfaction" },
  ],
  services: [
    { t: "Local & Outstation", d: "Flexible rentals for city & long-distance travel" },
    { t: "Group Tours", d: "Spacious tempo travellers for family & pilgrimages" },
    { t: "Corporate Travel", d: "Professional transport for business needs" },
    { t: "Wedding Transport", d: "Elegant vehicles for your special day" },
    { t: "Airport Transfers", d: "Reliable pickup & drop services" },
    { t: "Hourly Rentals", d: "Flexible packages for short trips" },
    { t: "Safe & Insured", d: "Fully insured fleet, experienced drivers" },
    { t: "24/7 Support", d: "Round-the-clock customer support" },
  ],
};

function AdminSettings() {
  const [contact, setContact] = useState<ContactCfg>({ phones: [], email: "", whatsapp: "", address: "" });
  const [payment, setPayment] = useState<PaymentCfg>({ upi_id: "", qr_image: "", cod_enabled: true, note: "" });
  const [hero, setHero] = useState<HeroCfg>({ title: "", subtitle: "", tagline: "", images: [] });
  const [landing, setLanding] = useState<LandingCfg>(defaultLanding);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("key,value");
      data?.forEach((row) => {
        if (row.key === "contact") setContact(row.value as ContactCfg);
        if (row.key === "payment") setPayment(row.value as PaymentCfg);
        if (row.key === "hero") setHero(row.value as HeroCfg);
        if (row.key === "landing") setLanding({ ...defaultLanding, ...(row.value as Partial<LandingCfg>) });
      });
      setLoading(false);
    })();
  }, []);

  const save = async (key: string, value: object) => {
    await supabase.from("site_settings").upsert([{ key, value: value as never }]);
    setSaved(key);
    setTimeout(() => setSaved(""), 1500);
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <h1 className="font-display text-3xl mb-8">Site Settings</h1>

      <Section title="Hero Section" saved={saved === "hero"} onSave={() => save("hero", hero)}>
        <Field label="Tagline" value={hero.tagline} onChange={(v) => setHero({ ...hero, tagline: v })} />
        <Field label="Title" value={hero.title} onChange={(v) => setHero({ ...hero, title: v })} />
        <Field label="Subtitle" value={hero.subtitle} onChange={(v) => setHero({ ...hero, subtitle: v })} />
      </Section>

      <Section title="Landing — Fleet Section" saved={saved === "landing"} onSave={() => save("landing", landing)}>
        <Field label="Fleet Heading" value={landing.fleet_heading} onChange={(v) => setLanding({ ...landing, fleet_heading: v })} />
        <Field label="Fleet Subheading" value={landing.fleet_subheading} onChange={(v) => setLanding({ ...landing, fleet_subheading: v })} textarea />

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Stats (4 cards)</h3>
            <button
              type="button"
              onClick={() => setLanding({ ...landing, stats: [...landing.stats, { n: "", l: "" }] })}
              className="text-xs text-primary font-semibold"
            >+ Add</button>
          </div>
          {landing.stats.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 mb-2 items-center">
              <input value={s.n} onChange={(e) => {
                const next = [...landing.stats]; next[i] = { ...next[i], n: e.target.value };
                setLanding({ ...landing, stats: next });
              }} placeholder="10+" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <input value={s.l} onChange={(e) => {
                const next = [...landing.stats]; next[i] = { ...next[i], l: e.target.value };
                setLanding({ ...landing, stats: next });
              }} placeholder="Years Experience" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <button type="button" onClick={() => setLanding({ ...landing, stats: landing.stats.filter((_, j) => j !== i) })} className="text-destructive text-xs font-semibold px-2">×</button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <Field label="Services Tagline" value={landing.services_tagline} onChange={(v) => setLanding({ ...landing, services_tagline: v })} />
          <Field label="Services Heading" value={landing.services_heading} onChange={(v) => setLanding({ ...landing, services_heading: v })} />
          <Field label="Services Intro" value={landing.services_intro} onChange={(v) => setLanding({ ...landing, services_intro: v })} textarea />
          <div className="flex items-center justify-between mt-3 mb-2">
            <h3 className="font-semibold text-sm">Service Cards</h3>
            <button
              type="button"
              onClick={() => setLanding({ ...landing, services: [...landing.services, { t: "", d: "" }] })}
              className="text-xs text-primary font-semibold"
            >+ Add</button>
          </div>
          {landing.services.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 mb-2 items-center">
              <input value={s.t} onChange={(e) => {
                const next = [...landing.services]; next[i] = { ...next[i], t: e.target.value };
                setLanding({ ...landing, services: next });
              }} placeholder="Title" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <input value={s.d} onChange={(e) => {
                const next = [...landing.services]; next[i] = { ...next[i], d: e.target.value };
                setLanding({ ...landing, services: next });
              }} placeholder="Description" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <button type="button" onClick={() => setLanding({ ...landing, services: landing.services.filter((_, j) => j !== i) })} className="text-destructive text-xs font-semibold px-2">×</button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <Field label="Final CTA Heading" value={landing.cta_heading} onChange={(v) => setLanding({ ...landing, cta_heading: v })} />
          <Field label="Final CTA Subheading" value={landing.cta_subheading} onChange={(v) => setLanding({ ...landing, cta_subheading: v })} textarea />
        </div>
      </Section>

      <Section title="Contact Info" saved={saved === "contact"} onSave={() => save("contact", contact)}>
        <Field label="Phone Numbers (comma separated)" value={contact.phones.join(", ")} onChange={(v) => setContact({ ...contact, phones: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
        <Field label="WhatsApp Number (with country code)" value={contact.whatsapp} onChange={(v) => setContact({ ...contact, whatsapp: v })} />
        <Field label="Email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} />
        <Field label="Address" value={contact.address} onChange={(v) => setContact({ ...contact, address: v })} textarea />
      </Section>

      <Section title="Payment Options" saved={saved === "payment"} onSave={() => save("payment", payment)}>
        <Field label="UPI ID" value={payment.upi_id} onChange={(v) => setPayment({ ...payment, upi_id: v })} />
        <Field label="QR Image URL (optional — auto-generated if empty)" value={payment.qr_image} onChange={(v) => setPayment({ ...payment, qr_image: v })} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={payment.cod_enabled} onChange={(e) => setPayment({ ...payment, cod_enabled: e.target.checked })} />
          Cash on Delivery enabled
        </label>
        <Field label="Payment Note" value={payment.note} onChange={(v) => setPayment({ ...payment, note: v })} textarea />
      </Section>
    </div>
  );
}

function Section({ title, children, onSave, saved }: { title: string; children: React.ReactNode; onSave: () => void; saved: boolean }) {
  return (
    <div className="mb-6 p-6 rounded-2xl bg-card border border-border shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">{title}</h2>
        <button onClick={onSave} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
          <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save"}
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
      )}
    </div>
  );
}
