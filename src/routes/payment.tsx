import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Smartphone, QrCode, Banknote, MessageCircle, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Payment Options — MNM Travels" },
      { name: "description", content: "Pay via UPI, scan QR code, or choose Cash on Delivery (COD). Secure & flexible payment options." },
    ],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const [upi, setUpi] = useState("mnmtravels@upi");
  const [qrImage, setQrImage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "payment").maybeSingle().then(({ data }) => {
      const v = (data?.value as { upi_id?: string; qr_image?: string }) ?? {};
      if (v.upi_id) setUpi(v.upi_id);
      if (v.qr_image) setQrImage(v.qr_image);
    });
  }, []);

  // Build dynamic UPI QR via Google Chart fallback if no custom QR
  const upiUri = `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent("MNM Travels")}&cu=INR`;
  const qrSrc = qrImage || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUri)}`;

  const copy = async () => {
    await navigator.clipboard.writeText(upi);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-secondary font-bold text-sm uppercase tracking-widest">Payment Options</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Pay Your Way</h1>
        <p className="mt-4 text-muted-foreground">Choose any of the secure payment options below. Confirm payment via WhatsApp.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* UPI */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center mb-4"><Smartphone className="w-6 h-6" /></div>
          <h3 className="font-display text-2xl">UPI Payment</h3>
          <p className="text-sm text-muted-foreground mt-1">Pay instantly using any UPI app</p>
          <div className="mt-5 p-4 rounded-xl bg-muted">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">UPI ID</div>
            <div className="flex items-center justify-between mt-1">
              <code className="text-base font-mono font-bold">{upi}</code>
              <button onClick={copy} className="p-2 rounded-md hover:bg-background transition-smooth">
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <a href={upiUri} className="mt-4 block w-full text-center bg-gradient-primary text-primary-foreground py-3 rounded-full font-semibold shadow-elegant hover:scale-[1.02] transition-smooth">
            Open in UPI App
          </a>
        </div>

        {/* QR */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <div className="w-12 h-12 rounded-xl bg-gradient-gold text-secondary-foreground grid place-items-center mb-4 shadow-gold"><QrCode className="w-6 h-6" /></div>
          <h3 className="font-display text-2xl">Scan QR Code</h3>
          <p className="text-sm text-muted-foreground mt-1">Use any UPI app to scan</p>
          <div className="mt-5 p-4 bg-white rounded-xl grid place-items-center">
            <img src={qrSrc} alt="UPI QR Code" width={240} height={240} className="rounded-lg" />
          </div>
          <p className="text-xs text-center text-muted-foreground mt-3">Pays to <strong>{upi}</strong></p>
        </div>

        {/* COD */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
          <div className="w-12 h-12 rounded-xl bg-success text-success-foreground grid place-items-center mb-4"><Banknote className="w-6 h-6" /></div>
          <h3 className="font-display text-2xl">Cash on Delivery</h3>
          <p className="text-sm text-muted-foreground mt-1">Pay our driver directly in cash</p>
          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            <li>✓ Pay at pickup or drop-off</li>
            <li>✓ No advance required for short trips</li>
            <li>✓ Receipt provided on request</li>
          </ul>
          <a
            href={whatsappLink("Hi MNM Travels, I'd like to book with COD payment.")}
            target="_blank"
            rel="noopener"
            className="mt-5 block w-full text-center bg-success text-success-foreground py-3 rounded-full font-semibold shadow-gold hover:scale-[1.02] transition-smooth"
          >
            Confirm COD via WhatsApp
          </a>
        </div>
      </div>

      <div className="mt-10 max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-primary text-primary-foreground text-center shadow-elegant">
        <MessageCircle className="w-10 h-10 mx-auto mb-3 text-secondary" />
        <h3 className="font-display text-2xl">After payment, share screenshot on WhatsApp</h3>
        <p className="mt-2 text-primary-foreground/80 text-sm">We'll confirm your booking instantly.</p>
        <a
          href={whatsappLink("Hi MNM Travels, I've made the payment. Sharing the screenshot.")}
          target="_blank"
          rel="noopener"
          className="mt-5 inline-flex items-center gap-2 bg-success text-success-foreground px-6 py-3 rounded-full font-bold hover:scale-105 transition-smooth"
        >
          <MessageCircle className="w-4 h-4" /> Send Payment Screenshot
        </a>
      </div>
    </div>
  );
}
