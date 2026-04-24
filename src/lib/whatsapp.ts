export const WHATSAPP_NUMBER = "919492456488";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function bookingMessage(opts: {
  vehicle?: string;
  name?: string;
  pickup?: string;
  drop?: string;
  date?: string;
  notes?: string;
}) {
  const lines = [
    "Hello MNM Travels, I'd like to book a ride.",
    opts.vehicle ? `🚗 Vehicle: ${opts.vehicle}` : "",
    opts.name ? `👤 Name: ${opts.name}` : "",
    opts.pickup ? `📍 Pickup: ${opts.pickup}` : "",
    opts.drop ? `🎯 Drop: ${opts.drop}` : "",
    opts.date ? `📅 Date: ${opts.date}` : "",
    opts.notes ? `📝 Notes: ${opts.notes}` : "",
  ].filter(Boolean);
  return lines.join("\n");
}
