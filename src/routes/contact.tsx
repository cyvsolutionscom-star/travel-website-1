import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { useSiteSetting } from "@/hooks/useSiteSetting";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact MNM Travels — Tadipatri, Anantapur" },
      { name: "description", content: "Reach MNM Travels 24/7. Phone: 9492456488 / 9441805777. Email: mnmtravels6077@gmail.com" },
      { property: "og:title", content: "Contact MNM Travels" },
      { property: "og:description", content: "Get in touch — 24/7 available." },
    ],
  }),
  component: ContactPage,
});

const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15293.774!2d78.0094!3d15.0345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb5e7e1c9b7b6d5%3A0x2e4c9e8e8b8b8b8b!2sTadipatri%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

function ContactPage() {
  const { value: contact } = useSiteSetting<{ map_embed_url?: string }>("contact", {});
  const mapUrl = contact.map_embed_url || defaultMapUrl;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-secondary font-bold text-sm uppercase tracking-widest">Get in Touch</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Contact Us</h1>
        <p className="mt-4 text-muted-foreground">Have questions or ready to book? Reach out to us anytime — we're here to help!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <a href="tel:919492456488" className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant transition-smooth">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center mb-4"><Phone className="w-6 h-6" /></div>
          <h3 className="font-semibold text-lg">Phone Numbers</h3>
          <p className="text-muted-foreground text-sm mt-2">9492456488<br />9441805777<br />8099079719</p>
        </a>
        <a href="mailto:mnmtravels6077@gmail.com" className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant transition-smooth">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center mb-4"><Mail className="w-6 h-6" /></div>
          <h3 className="font-semibold text-lg">Email Address</h3>
          <p className="text-muted-foreground text-sm mt-2 break-all">mnmtravels6077@gmail.com</p>
        </a>
        <a href="https://maps.google.com/?q=Tadipatri,Anantapur,AP" target="_blank" rel="noopener" className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant transition-smooth">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center mb-4"><MapPin className="w-6 h-6" /></div>
          <h3 className="font-semibold text-lg">Office Address</h3>
          <p className="text-muted-foreground text-sm mt-2">12/80 Main Bazar Road<br />Opp. Hanuman Statue<br />Tadipatri - 515411, AP</p>
        </a>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-muted">
          <div className="flex items-center gap-3"><Clock className="w-6 h-6 text-secondary" /><h3 className="font-semibold text-lg">Working Hours</h3></div>
          <p className="text-muted-foreground mt-2">24/7 Available — We never sleep!</p>
        </div>
        <a
          href={whatsappLink("Hi MNM Travels, I'd like to know about your services.")}
          target="_blank"
          rel="noopener"
          className="p-6 rounded-2xl bg-success text-success-foreground flex items-center justify-between shadow-gold hover:scale-[1.02] transition-smooth"
        >
          <div>
            <h3 className="font-semibold text-lg">Chat on WhatsApp</h3>
            <p className="text-sm opacity-90 mt-1">Instant replies, 24/7</p>
          </div>
          <MessageCircle className="w-10 h-10" />
        </a>
      </div>

      {/* Google Maps Embed — dynamic from admin settings */}
      <div className="mt-10 rounded-2xl overflow-hidden border border-border shadow-card">
        <iframe
          title="MNM Travels Location"
          src={mapUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
