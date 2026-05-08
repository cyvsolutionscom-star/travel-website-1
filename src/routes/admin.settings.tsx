import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/ImageUpload";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

type ContactCfg = { phones: string[]; email: string; whatsapp: string; address: string; map_embed_url: string };
type PaymentCfg = { upi_id: string; qr_image: string; cod_enabled: boolean; note: string };
type HeroCfg = { title: string; subtitle: string; tagline: string; images: string[] };
type StatItem = { n: string; l: string };
type ServiceItem = { t: string; d: string };
type TestimonialItem = { name: string; text: string; rating: number; location: string };
type WhyItem = { title: string; desc: string };
type RouteItem = { from: string; to: string; price: string; image?: string };
type StepItem = { title: string; desc: string };
type FaqItem = { q: string; a: string };
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
  testimonials_heading: string;
  testimonials: TestimonialItem[];
  why_heading: string;
  why_subtitle: string;
  why_items: WhyItem[];
  routes_heading: string;
  routes_subtitle: string;
  popular_routes: RouteItem[];
  steps_heading: string;
  steps_subtitle: string;
  steps: StepItem[];
  faq_heading: string;
  faq_subtitle: string;
  faqs: FaqItem[];
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
  testimonials_heading: "What Our Customers Say",
  testimonials: [
    { name: "Ravi Kumar", text: "Excellent service! The car was clean and the driver was very professional.", rating: 5, location: "Hyderabad" },
    { name: "Priya Sharma", text: "Best travel agency in Tadipatri. Very affordable and reliable.", rating: 5, location: "Bangalore" },
    { name: "Suresh Reddy", text: "Booked a tempo traveller for pilgrimage. Great experience!", rating: 4, location: "Anantapur" },
  ],
  why_heading: "Why Choose MNM Travels?",
  why_subtitle: "We go the extra mile to make your journey comfortable and memorable.",
  why_items: [
    { title: "Experienced Drivers", desc: "All our drivers are professionally trained with 5+ years of experience." },
    { title: "Well-Maintained Fleet", desc: "Every vehicle is serviced regularly and kept in top condition." },
    { title: "Transparent Pricing", desc: "No hidden charges. What you see is what you pay." },
    { title: "Pan-India Coverage", desc: "We cover all major cities and pilgrimage routes across India." },
  ],
  routes_heading: "Popular Routes",
  routes_subtitle: "Frequently booked travel routes from Tadipatri",
  popular_routes: [
    { from: "Tadipatri", to: "Hyderabad", price: "₹4,500" },
    { from: "Tadipatri", to: "Bangalore", price: "₹6,000" },
    { from: "Tadipatri", to: "Tirupati", price: "₹5,500" },
    { from: "Tadipatri", to: "Chennai", price: "₹8,000" },
    { from: "Anantapur", to: "Hyderabad", price: "₹4,000" },
    { from: "Tadipatri", to: "Mantralayam", price: "₹2,500" },
    { from: "Tadipatri", to: "Goa", price: "₹12,000" },
    { from: "Tadipatri", to: "Mumbai", price: "₹15,000" },
    { from: "Tadipatri", to: "Vijayawada", price: "₹5,000" },
    { from: "Tadipatri", to: "Srisailam", price: "₹3,500" },
    { from: "Anantapur", to: "Bangalore", price: "₹5,500" },
    { from: "Tadipatri", to: "Kurnool", price: "₹2,000" },
    { from: "Tadipatri", to: "Kadapa", price: "₹2,500" },
    { from: "Tadipatri", to: "Vizag", price: "₹8,500" },
    { from: "Tadipatri", to: "Hampi", price: "₹4,000" },
    { from: "Tadipatri", to: "Shirdi", price: "₹10,000" },
  ],
  steps_heading: "How It Works",
  steps_subtitle: "Book your ride in 3 simple steps",
  steps: [
    { title: "Choose Your Vehicle", desc: "Browse our fleet and pick the vehicle that suits your trip." },
    { title: "Book via WhatsApp", desc: "Send us your travel details on WhatsApp — date, time, route." },
    { title: "Enjoy Your Ride", desc: "Our driver picks you up on time. Sit back and enjoy the journey!" },
  ],
  faq_heading: "Frequently Asked Questions",
  faq_subtitle: "Got questions? We've got answers.",
  faqs: [
    { q: "What are your operating hours?", a: "We operate 24/7. You can book a ride anytime." },
    { q: "Do you provide outstation trips?", a: "Yes! We cover all major cities across India." },
    { q: "Is there a driver included?", a: "Yes, all our rentals include an experienced driver." },
    { q: "What payment methods do you accept?", a: "We accept UPI, bank transfer, cash, and online payments." },
    { q: "Can I cancel my booking?", a: "Yes, free cancellation up to 24 hours before the trip." },
  ],
};

function AdminSettings() {
  const [contact, setContact] = useState<ContactCfg>({ phones: [], email: "", whatsapp: "", address: "", map_embed_url: "" });
  const [payment, setPayment] = useState<PaymentCfg>({ upi_id: "", qr_image: "", cod_enabled: true, note: "" });
  const [hero, setHero] = useState<HeroCfg>({ title: "", subtitle: "", tagline: "", images: [] });
  const [landing, setLanding] = useState<LandingCfg>(defaultLanding);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("key,value");
      data?.forEach((row) => {
        if (row.key === "contact") setContact({ phones: [], email: "", whatsapp: "", address: "", map_embed_url: "", ...(row.value as Partial<ContactCfg>) });
        if (row.key === "payment") setPayment(row.value as PaymentCfg);
        if (row.key === "hero") setHero({ title: "", subtitle: "", tagline: "", images: [], ...(row.value as Partial<HeroCfg>) });
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
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Hero Slideshow Images</h3>
            <button
              type="button"
              onClick={() => setHero({ ...hero, images: [...hero.images, ""] })}
              className="text-xs text-primary font-semibold"
            >+ Add Slot</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {hero.images.map((img, i) => (
              <div key={i} className="relative">
                <ImageUpload
                  value={img}
                  onChange={(url) => {
                    const next = [...hero.images];
                    next[i] = url;
                    setHero({ ...hero, images: next });
                  }}
                  folder="hero"
                  className="aspect-video"
                />
                <button
                  type="button"
                  onClick={() => setHero({ ...hero, images: hero.images.filter((_, j) => j !== i) })}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs grid place-items-center"
                >×</button>
              </div>
            ))}
          </div>
        </div>
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

        {/* Testimonials */}
        <div className="pt-4 border-t border-border">
          <Field label="Testimonials Heading" value={landing.testimonials_heading} onChange={(v) => setLanding({ ...landing, testimonials_heading: v })} />
          <div className="flex items-center justify-between mt-3 mb-2">
            <h3 className="font-semibold text-sm">Testimonials</h3>
            <button type="button" onClick={() => setLanding({ ...landing, testimonials: [...landing.testimonials, { name: "", text: "", rating: 5, location: "" }] })} className="text-xs text-primary font-semibold">+ Add</button>
          </div>
          {landing.testimonials.map((t, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 mb-3 p-3 rounded-lg bg-muted/50">
              <div className="grid grid-cols-2 gap-2">
                <input value={t.name} onChange={(e) => { const next = [...landing.testimonials]; next[i] = { ...next[i], name: e.target.value }; setLanding({ ...landing, testimonials: next }); }} placeholder="Name" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
                <input value={t.location} onChange={(e) => { const next = [...landing.testimonials]; next[i] = { ...next[i], location: e.target.value }; setLanding({ ...landing, testimonials: next }); }} placeholder="Location" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              </div>
              <textarea value={t.text} onChange={(e) => { const next = [...landing.testimonials]; next[i] = { ...next[i], text: e.target.value }; setLanding({ ...landing, testimonials: next }); }} placeholder="Review text" rows={2} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">Rating:</label>
                <select value={t.rating} onChange={(e) => { const next = [...landing.testimonials]; next[i] = { ...next[i], rating: Number(e.target.value) }; setLanding({ ...landing, testimonials: next }); }} className="rounded-md border border-input bg-background px-2 py-1 text-sm">
                  {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
                </select>
                <button type="button" onClick={() => setLanding({ ...landing, testimonials: landing.testimonials.filter((_, j) => j !== i) })} className="ml-auto text-destructive text-xs font-semibold px-2">× Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="pt-4 border-t border-border">
          <Field label="Why Choose Us — Heading" value={landing.why_heading} onChange={(v) => setLanding({ ...landing, why_heading: v })} />
          <Field label="Why Choose Us — Subtitle" value={landing.why_subtitle} onChange={(v) => setLanding({ ...landing, why_subtitle: v })} textarea />
          <div className="flex items-center justify-between mt-3 mb-2">
            <h3 className="font-semibold text-sm">Reasons</h3>
            <button type="button" onClick={() => setLanding({ ...landing, why_items: [...landing.why_items, { title: "", desc: "" }] })} className="text-xs text-primary font-semibold">+ Add</button>
          </div>
          {landing.why_items.map((w, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 mb-2 items-center">
              <input value={w.title} onChange={(e) => { const next = [...landing.why_items]; next[i] = { ...next[i], title: e.target.value }; setLanding({ ...landing, why_items: next }); }} placeholder="Title" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <input value={w.desc} onChange={(e) => { const next = [...landing.why_items]; next[i] = { ...next[i], desc: e.target.value }; setLanding({ ...landing, why_items: next }); }} placeholder="Description" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <button type="button" onClick={() => setLanding({ ...landing, why_items: landing.why_items.filter((_, j) => j !== i) })} className="text-destructive text-xs font-semibold px-2">×</button>
            </div>
          ))}
        </div>

        {/* Popular Routes */}
        <div className="pt-4 border-t border-border">
          <Field label="Popular Routes — Heading" value={landing.routes_heading} onChange={(v) => setLanding({ ...landing, routes_heading: v })} />
          <Field label="Popular Routes — Subtitle" value={landing.routes_subtitle} onChange={(v) => setLanding({ ...landing, routes_subtitle: v })} textarea />
          <div className="flex items-center justify-between mt-3 mb-2">
            <h3 className="font-semibold text-sm">Routes</h3>
            <button type="button" onClick={() => setLanding({ ...landing, popular_routes: [...landing.popular_routes, { from: "", to: "", price: "" }] })} className="text-xs text-primary font-semibold">+ Add</button>
          </div>
          {landing.popular_routes.map((r, i) => (
            <div key={i} className="mb-3 p-3 rounded-lg bg-muted/50">
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 mb-2 items-center">
                <input value={r.from} onChange={(e) => { const next = [...landing.popular_routes]; next[i] = { ...next[i], from: e.target.value }; setLanding({ ...landing, popular_routes: next }); }} placeholder="From" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
                <input value={r.to} onChange={(e) => { const next = [...landing.popular_routes]; next[i] = { ...next[i], to: e.target.value }; setLanding({ ...landing, popular_routes: next }); }} placeholder="To" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
                <input value={r.price} onChange={(e) => { const next = [...landing.popular_routes]; next[i] = { ...next[i], price: e.target.value }; setLanding({ ...landing, popular_routes: next }); }} placeholder="₹4,500" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
                <button type="button" onClick={() => setLanding({ ...landing, popular_routes: landing.popular_routes.filter((_, j) => j !== i) })} className="text-destructive text-xs font-semibold px-2">×</button>
              </div>
              <ImageUpload
                value={r.image || ""}
                onChange={(url) => { const next = [...landing.popular_routes]; next[i] = { ...next[i], image: url }; setLanding({ ...landing, popular_routes: next }); }}
                folder="routes"
                className="aspect-video max-w-[200px]"
              />
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="pt-4 border-t border-border">
          <Field label="How It Works — Heading" value={landing.steps_heading} onChange={(v) => setLanding({ ...landing, steps_heading: v })} />
          <Field label="How It Works — Subtitle" value={landing.steps_subtitle} onChange={(v) => setLanding({ ...landing, steps_subtitle: v })} textarea />
          <div className="flex items-center justify-between mt-3 mb-2">
            <h3 className="font-semibold text-sm">Steps</h3>
            <button type="button" onClick={() => setLanding({ ...landing, steps: [...landing.steps, { title: "", desc: "" }] })} className="text-xs text-primary font-semibold">+ Add</button>
          </div>
          {landing.steps.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 mb-2 items-center">
              <input value={s.title} onChange={(e) => { const next = [...landing.steps]; next[i] = { ...next[i], title: e.target.value }; setLanding({ ...landing, steps: next }); }} placeholder="Step title" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <input value={s.desc} onChange={(e) => { const next = [...landing.steps]; next[i] = { ...next[i], desc: e.target.value }; setLanding({ ...landing, steps: next }); }} placeholder="Description" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <button type="button" onClick={() => setLanding({ ...landing, steps: landing.steps.filter((_, j) => j !== i) })} className="text-destructive text-xs font-semibold px-2">×</button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="pt-4 border-t border-border">
          <Field label="FAQ — Heading" value={landing.faq_heading} onChange={(v) => setLanding({ ...landing, faq_heading: v })} />
          <Field label="FAQ — Subtitle" value={landing.faq_subtitle} onChange={(v) => setLanding({ ...landing, faq_subtitle: v })} textarea />
          <div className="flex items-center justify-between mt-3 mb-2">
            <h3 className="font-semibold text-sm">Questions</h3>
            <button type="button" onClick={() => setLanding({ ...landing, faqs: [...landing.faqs, { q: "", a: "" }] })} className="text-xs text-primary font-semibold">+ Add</button>
          </div>
          {landing.faqs.map((f, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 mb-3 p-3 rounded-lg bg-muted/50">
              <input value={f.q} onChange={(e) => { const next = [...landing.faqs]; next[i] = { ...next[i], q: e.target.value }; setLanding({ ...landing, faqs: next }); }} placeholder="Question" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <textarea value={f.a} onChange={(e) => { const next = [...landing.faqs]; next[i] = { ...next[i], a: e.target.value }; setLanding({ ...landing, faqs: next }); }} placeholder="Answer" rows={2} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
              <button type="button" onClick={() => setLanding({ ...landing, faqs: landing.faqs.filter((_, j) => j !== i) })} className="text-destructive text-xs font-semibold px-2 text-left">× Remove</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Contact Info" saved={saved === "contact"} onSave={() => save("contact", contact)}>
        <Field label="Phone Numbers (comma separated)" value={contact.phones.join(", ")} onChange={(v) => setContact({ ...contact, phones: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
        <Field label="WhatsApp Number (with country code)" value={contact.whatsapp} onChange={(v) => setContact({ ...contact, whatsapp: v })} />
        <Field label="Email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} />
        <Field label="Address" value={contact.address} onChange={(v) => setContact({ ...contact, address: v })} textarea />
        <div className="pt-4 border-t border-border">
          <Field label="Google Maps Embed URL" value={contact.map_embed_url} onChange={(v) => setContact({ ...contact, map_embed_url: v })} textarea />
          <p className="text-xs text-muted-foreground mt-1">
            Go to <a href="https://www.google.com/maps" target="_blank" rel="noopener" className="text-primary underline">Google Maps</a> → search your location → click <strong>Share</strong> → <strong>Embed a map</strong> → copy the <code>src="..."</code> URL and paste it here.
          </p>
          {contact.map_embed_url && (
            <div className="mt-3 rounded-lg overflow-hidden border border-border">
              <iframe src={contact.map_embed_url} width="100%" height="200" style={{ border: 0 }} loading="lazy" title="Map Preview" />
            </div>
          )}
        </div>
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
