import { createFileRoute } from "@tanstack/react-router";
import { Car, Users, Briefcase, Heart, Plane, Clock, ShieldCheck, HeadphonesIcon } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — MNM Travels" },
      { name: "description", content: "Local & outstation, group tours, corporate travel, wedding transport, airport transfers and more." },
      { property: "og:title", content: "Our Services — MNM Travels" },
      { property: "og:description", content: "All-in-one transportation services across India." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Car, t: "Local & Outstation", d: "Flexible rentals for city tours and long-distance travel across India." },
  { icon: Users, t: "Group Tours", d: "Spacious tempo travellers perfect for family trips and pilgrimages." },
  { icon: Briefcase, t: "Corporate Travel", d: "Professional transportation solutions for business needs." },
  { icon: Heart, t: "Wedding Transport", d: "Elegant vehicles for your special occasions and ceremonies." },
  { icon: Plane, t: "Airport Transfers", d: "Reliable pickup and drop services to all major airports." },
  { icon: Clock, t: "Hourly Rentals", d: "Flexible hourly packages for meetings and short trips." },
  { icon: ShieldCheck, t: "Safe & Insured", d: "All vehicles fully insured with experienced drivers." },
  { icon: HeadphonesIcon, t: "24/7 Support", d: "Round-the-clock customer support for all your queries." },
];

function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-secondary font-bold text-sm uppercase tracking-widest">What We Offer</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Our Premium Services</h1>
        <p className="mt-4 text-muted-foreground">Experience the best travel services — your trusted partner for comfortable and safe journeys.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((s) => (
          <div key={s.t} className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant hover:-translate-y-1 transition-smooth">
            <div className="w-12 h-12 rounded-xl bg-gradient-gold grid place-items-center text-secondary-foreground shadow-gold mb-4">
              <s.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">{s.t}</h3>
            <p className="text-sm text-muted-foreground mt-2">{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
