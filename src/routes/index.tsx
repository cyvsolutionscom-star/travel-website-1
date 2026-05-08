import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Shield, Clock, Users, Star, CheckCircle2, MessageCircle, Phone, Loader2, MapPin, ChevronDown, ChevronUp, Quote, Award } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import { supabase } from "@/integrations/supabase/client";
import { bookingMessage, whatsappLink } from "@/lib/whatsapp";
import { useSiteSetting } from "@/hooks/useSiteSetting";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MNM Travels — Premium Vehicle Rentals in Tadipatri & Anantapur" },
      { name: "description", content: "Comfortable, safe, affordable car & tempo traveller rentals across India. Innova, Tempo Traveller, Sedans. Book on WhatsApp 24/7." },
      { property: "og:title", content: "MNM Travels — Premium Vehicle Rentals" },
      { property: "og:description", content: "Premium vehicle rentals — sedans, SUVs, tempo travellers — across India since 2014." },
    ],
  }),
  component: HomePage,
});

const heroes = [hero1, hero2, hero3];

type Vehicle = {
  id: string;
  name: string;
  seater: number;
  daily_rent: number;
  per_km_rate: string | null;
  image_url: string | null;
  description: string | null;
};

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

function HomePage() {
  const [idx, setIdx] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [fleetLoading, setFleetLoading] = useState(true);
  const { value: landing } = useSiteSetting<LandingCfg>("landing", defaultLanding);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % heroes.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    supabase
      .from("vehicles")
      .select("id,name,seater,daily_rent,per_km_rate,image_url,description")
      .eq("active", true)
      .order("display_order", { ascending: true })
      .limit(6)
      .then(({ data }) => {
        setVehicles(data ?? []);
        setFleetLoading(false);
      });
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[560px] overflow-hidden">
        {heroes.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: idx === i ? 1 : 0 }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-hero" />
          </div>
        ))}

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center text-primary-foreground">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/90 text-secondary-foreground text-xs font-bold tracking-wider uppercase mb-6">
              Welcome to MNM Travels
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-balance leading-[1.05] max-w-4xl">
              Travel in <span className="text-secondary">Comfort</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-xl">
              Premium vehicle rentals — sedans, SUVs and tempo travellers — across India. Trusted since 2014.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/fleet"
                className="inline-flex items-center gap-2 bg-gradient-gold text-secondary-foreground px-7 py-4 rounded-full font-bold shadow-gold hover:scale-105 transition-smooth"
              >
                Explore Our Fleet <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={whatsappLink("Hi MNM Travels, I'd like to book a ride.")}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 bg-success text-success-foreground px-7 py-4 rounded-full font-bold shadow-elegant hover:scale-105 transition-smooth"
              >
                <MessageCircle className="w-4 h-4" /> Book via WhatsApp
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-6 text-sm">
              {[
                { icon: Shield, label: "Safe & Reliable" },
                { icon: Clock, label: "24/7 Support" },
                { icon: Users, label: "Pan India Service" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 text-primary-foreground/85">
                  <f.icon className="w-4 h-4 text-secondary" /> {f.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* slide indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {heroes.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-10 bg-secondary" : "w-4 bg-primary-foreground/40"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {landing.stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold text-primary">{s.n}</div>
              <div className="mt-1 text-sm text-muted-foreground uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FLEET & PRICING */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <span className="text-secondary font-bold text-sm uppercase tracking-widest">Our Fleet & Pricing</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2">{landing.fleet_heading}</h2>
            <p className="mt-4 text-muted-foreground">{landing.fleet_subheading}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/fleet" className="inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-smooth">
              View full fleet <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/request-car" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold text-sm hover:scale-[1.02] transition-smooth">
              Request a Vehicle
            </Link>
          </div>
        </div>

        {fleetLoading ? (
          <div className="py-16 grid place-items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : vehicles.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            No active vehicles available yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle, i) => (
              <motion.article
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant transition-smooth"
              >
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  {vehicle.image_url ? (
                    <img src={vehicle.image_url} alt={vehicle.name} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-muted-foreground font-semibold">MNM Travels</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl">{vehicle.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{vehicle.seater} seater</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display text-2xl text-primary">₹{vehicle.daily_rent.toLocaleString("en-IN")}</div>
                      <div className="text-xs text-muted-foreground">per day</div>
                    </div>
                  </div>
                  {vehicle.description && <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{vehicle.description}</p>}
                  {vehicle.per_km_rate && <div className="mt-4 text-sm font-semibold text-secondary">{vehicle.per_km_rate}</div>}
                  <a
                    href={whatsappLink(bookingMessage({ vehicle: vehicle.name }))}
                    target="_blank"
                    rel="noopener"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-success px-5 py-3 font-bold text-success-foreground shadow-elegant hover:scale-[1.02] transition-smooth"
                  >
                    <MessageCircle className="w-4 h-4" /> Book via WhatsApp
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* SERVICES PREVIEW */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-secondary font-bold text-sm uppercase tracking-widest">{landing.services_tagline}</span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">{landing.services_heading}</h2>
          <p className="mt-4 text-muted-foreground">{landing.services_intro}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {landing.services.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant hover:-translate-y-1 transition-smooth"
            >
              <CheckCircle2 className="w-8 h-8 text-secondary mb-3" />
              <h3 className="font-semibold text-lg">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-secondary font-bold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2">{landing.testimonials_heading}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {landing.testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-card"
              >
                <Quote className="w-8 h-8 text-secondary/40 mb-3" />
                <p className="text-muted-foreground text-sm leading-relaxed">{t.text}</p>
                <div className="mt-4 flex items-center gap-1 text-secondary">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{t.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-secondary font-bold text-sm uppercase tracking-widest">Why Us</span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">{landing.why_heading}</h2>
          <p className="mt-4 text-muted-foreground">{landing.why_subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {landing.why_items.map((w, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant hover:-translate-y-1 transition-smooth"
            >
              <Award className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-lg">{w.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{w.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* POPULAR ROUTES */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-secondary font-bold text-sm uppercase tracking-widest">Routes</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2">{landing.routes_heading}</h2>
            <p className="mt-4 text-muted-foreground">{landing.routes_subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {landing.popular_routes.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-5 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant transition-smooth"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">{r.from} → {r.to}</div>
                  </div>
                </div>
                <div className="font-display text-lg text-primary font-bold">{r.price}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-secondary font-bold text-sm uppercase tracking-widest">Process</span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">{landing.steps_heading}</h2>
          <p className="mt-4 text-muted-foreground">{landing.steps_subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {landing.steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground grid place-items-center mx-auto mb-4 text-2xl font-bold font-display shadow-card">
                {i + 1}
              </div>
              <h3 className="font-display text-xl font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FaqSection heading={landing.faq_heading} subtitle={landing.faq_subtitle} faqs={landing.faqs} />


      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-3xl bg-gradient-primary p-10 md:p-16 text-primary-foreground shadow-elegant relative overflow-hidden">
          <Star className="absolute -top-8 -right-8 w-48 h-48 text-secondary/20" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl">{landing.cta_heading}</h2>
            <p className="mt-3 text-primary-foreground/80">{landing.cta_subheading}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/fleet" className="inline-flex items-center gap-2 bg-gradient-gold text-secondary-foreground px-6 py-3 rounded-full font-bold shadow-gold hover:scale-105 transition-smooth">
                Book Your Ride <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:919492456488" className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-6 py-3 rounded-full font-bold border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-smooth">
                <Phone className="w-4 h-4" /> 919492456488
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqSection({ heading, subtitle, faqs }: { heading: string; subtitle: string; faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-secondary font-bold text-sm uppercase tracking-widest">FAQ</span>
        <h2 className="font-display text-4xl md:text-5xl mt-2">{heading}</h2>
        <p className="mt-4 text-muted-foreground">{subtitle}</p>
      </div>
      <div className="max-w-2xl mx-auto space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left font-semibold"
            >
              {f.q}
              {open === i ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
