import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Fuel, MessageCircle, Loader2 } from "lucide-react";
import { whatsappLink, bookingMessage } from "@/lib/whatsapp";
import { fetchActiveVehicles, type Vehicle } from "@/lib/vehicles";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Our Fleet — MNM Travels" },
      { name: "description", content: "Browse our premium fleet — Tata Zest, Toyota Innova, Tempo Travellers (10/12/17 seater). Transparent pricing." },
      { property: "og:title", content: "Our Fleet — MNM Travels" },
      { property: "og:description", content: "Sedans, SUVs and tempo travellers for every journey." },
    ],
  }),
  component: FleetPage,
});

function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let active = true;
    void fetchActiveVehicles().then(({ vehicles: list, fromFallback }) => {
      if (!active) return;
      setVehicles(list);
      setOffline(fromFallback);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-secondary font-bold text-sm uppercase tracking-widest">Our Fleet & Pricing</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Choose Your Perfect Vehicle</h1>
        <p className="mt-4 text-muted-foreground">Transparent pricing with no hidden charges. From compact sedans to spacious tempo travellers.</p>
      </div>

      {offline && !loading && (
        <p className="mb-8 text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl px-4 py-3 text-center max-w-2xl mx-auto">
          Showing default fleet. Connect Supabase to sync vehicles from the admin dashboard.
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:shadow-elegant transition-smooth"
            >
              <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                {v.image_url ? (
                  <img src={v.image_url} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-muted-foreground">No image</div>
                )}
                <span className="absolute top-3 left-3 bg-gradient-gold text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-gold">
                  {v.seater} Seater
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl font-bold">{v.name}</h3>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {v.seater} Seater</span>
                  {v.per_km_rate && <span className="flex items-center gap-1"><Fuel className="w-4 h-4" /> {v.per_km_rate}</span>}
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-primary">₹{v.daily_rent}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Daily Rent</div>
                  </div>
                  <Link
                    to="/book"
                    search={{ vehicle: v.name }}
                    className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-glow transition-smooth"
                  >
                    Book Now
                  </Link>
                </div>
                <a
                  href={whatsappLink(bookingMessage({ vehicle: v.name }))}
                  target="_blank"
                  rel="noopener"
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-success text-success-foreground py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-smooth"
                >
                  <MessageCircle className="w-4 h-4" /> Book via WhatsApp
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
