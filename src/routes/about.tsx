import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — MNM Travels" },
      { name: "description", content: "MNM Travels has served Tadipatri & Anantapur with premium vehicle rentals since 2014." },
      { property: "og:title", content: "About MNM Travels" },
      { property: "og:description", content: "Your trusted travel partner since 2014." },
      { property: "og:image", content: hero1 },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-secondary font-bold text-sm uppercase tracking-widest">About Us</span>
          <h1 className="font-display text-4xl md:text-5xl mt-2">Your Trusted Travel Partner Since 2014</h1>
          <p className="mt-5 text-muted-foreground">
            MNM Travels has been serving the Tadipatri and Anantapur region with premium vehicle rental
            services for over a decade. We take pride in offering reliable, comfortable, and affordable
            transportation solutions for all your travel needs.
          </p>
          <p className="mt-3 text-muted-foreground">
            Whether you're planning a family pilgrimage, corporate event, wedding celebration, or a simple
            outstation trip, our experienced drivers and well-maintained fleet ensure a safe and comfortable
            journey every time.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3">
            {[
              "Licensed & Verified Drivers",
              "Well-Maintained Vehicles",
              "Transparent Pricing",
              "Flexible Booking Options",
              "GPS Enabled Vehicles",
              "Insurance Covered",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-elegant">
          <img src={hero1} alt="MNM Travels fleet" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>

      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { n: "10+", l: "Years" },
          { n: "5000+", l: "Trips" },
          { n: "8+", l: "Vehicles" },
          { n: "100%", l: "Safe" },
        ].map((s) => (
          <div key={s.l} className="text-center p-6 rounded-2xl bg-muted">
            <div className="font-display text-4xl font-bold text-primary">{s.n}</div>
            <div className="mt-1 text-sm text-muted-foreground uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
