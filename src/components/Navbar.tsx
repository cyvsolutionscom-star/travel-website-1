import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/fleet", label: "Fleet" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/payment", label: "Payment" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="w-9 h-9 rounded-lg bg-gradient-primary text-primary-foreground grid place-items-center shadow-elegant">M</span>
          <span>MNM <span className="text-secondary">Travels</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-md transition-smooth"
              activeProps={{ className: "px-3 py-2 text-sm font-bold text-primary rounded-md" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="tel:919492456488" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-gold text-secondary-foreground text-sm font-semibold shadow-gold hover:scale-105 transition-smooth">
            <Phone className="w-4 h-4" /> Call Now
          </a>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2" aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted">
                {l.label}
              </Link>
            ))}
            <Link to="/admin/login" onClick={() => setOpen(false)} className="px-3 py-2.5 text-xs text-muted-foreground">
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
