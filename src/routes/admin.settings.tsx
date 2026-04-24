import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

type ContactCfg = { phones: string[]; email: string; whatsapp: string; address: string };
type PaymentCfg = { upi_id: string; qr_image: string; cod_enabled: boolean; note: string };
type HeroCfg = { title: string; subtitle: string; tagline: string };

function AdminSettings() {
  const [contact, setContact] = useState<ContactCfg>({ phones: [], email: "", whatsapp: "", address: "" });
  const [payment, setPayment] = useState<PaymentCfg>({ upi_id: "", qr_image: "", cod_enabled: true, note: "" });
  const [hero, setHero] = useState<HeroCfg>({ title: "", subtitle: "", tagline: "" });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("key,value");
      data?.forEach((row) => {
        if (row.key === "contact") setContact(row.value as ContactCfg);
        if (row.key === "payment") setPayment(row.value as PaymentCfg);
        if (row.key === "hero") setHero(row.value as HeroCfg);
      });
      setLoading(false);
    })();
  }, []);

  const save = async (key: string, value: object) => {
    await supabase.from("site_settings").upsert({ key, value });
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
