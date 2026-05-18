import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { useSiteSetting } from "@/hooks/useSiteSetting";

export function Footer() {
  const { value: logo } = useSiteSetting("logo", { logo_url: "", logo_text: "MNM Travels", use_image: false });

  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 font-display text-2xl font-bold mb-4">
            {logo.use_image && logo.logo_url ? (
              <img src={logo.logo_url} alt={logo.logo_text || "MNM Travels"} className="h-12 w-auto object-contain brightness-0 invert" />
            ) : (
              <>
                <span className="w-10 h-10 rounded-lg bg-gradient-gold text-secondary-foreground grid place-items-center">
                  {(logo.logo_text || "MNM Travels")[0]}
                </span>
                <span>
                  {(() => {
                    const parts = (logo.logo_text || "MNM Travels").split(" ");
                    if (parts.length > 1) {
                      return (
                        <>
                          {parts.slice(0, -1).join(" ")} <span className="text-secondary">{parts[parts.length - 1]}</span>
                        </>
                      );
                    }
                    return parts[0];
                  })()}
                </span>
              </>
            )}
          </div>
          <p className="text-sm text-primary-foreground/70">
            Premium vehicle rentals across India since 2014. Comfortable, safe, and reliable.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-secondary">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/fleet" className="hover:text-secondary">Our Fleet</Link></li>
            <li><Link to="/services" className="hover:text-secondary">Services</Link></li>
            <li><Link to="/about" className="hover:text-secondary">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-secondary">Contact</Link></li>
            <li><Link to="/payment" className="hover:text-secondary">Payment Options</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-secondary">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5" /> 9492456488 / 9441805777</li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5" /> mnmtravels6077@gmail.com</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /> Tadipatri, Anantapur, AP - 515411</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-secondary">Book on WhatsApp</h4>
          <a
            href={whatsappLink("Hi MNM Travels, I'd like to know about your services.")}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 bg-success text-success-foreground px-5 py-3 rounded-full font-semibold shadow-gold hover:scale-105 transition-smooth"
          >
            <MessageCircle className="w-4 h-4" /> Chat Now
          </a>
          <Link to="/admin/login" className="block mt-6 text-xs text-primary-foreground/50 hover:text-secondary">
            Admin Login →
          </Link>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/60">
        © 2025 MNM Travels. All rights reserved.
      </div>
    </footer>
  );
}
