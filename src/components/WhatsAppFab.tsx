import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Hi MNM Travels, I'd like to book a ride.")}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-success text-success-foreground grid place-items-center shadow-gold hover:scale-110 transition-smooth animate-pulse"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
