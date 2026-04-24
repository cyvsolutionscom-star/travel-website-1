
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Vehicles (fleet)
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  seater INT NOT NULL,
  daily_rent INT NOT NULL,
  per_km_rate TEXT,
  image_url TEXT,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active vehicles" ON public.vehicles FOR SELECT USING (active = true);
CREATE POLICY "Admins read all vehicles" ON public.vehicles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage vehicles" ON public.vehicles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  vehicle_name TEXT,
  pickup_location TEXT NOT NULL,
  drop_location TEXT,
  travel_date DATE NOT NULL,
  return_date DATE,
  payment_method TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit booking" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read bookings" ON public.bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete bookings" ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Site settings (key-value store for editable content)
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed vehicles
INSERT INTO public.vehicles (name, seater, daily_rent, per_km_rate, description, display_order) VALUES
('Tata Zest', 4, 1300, '₹12/km', 'Comfortable sedan ideal for city tours and small family trips.', 1),
('Toyota Innova', 7, 1800, '₹8/km', 'Premium 7-seater SUV for family and group travel.', 2),
('Tempo Traveller 12', 12, 3000, '₹8/km', 'Spacious 12-seater for medium groups and pilgrimages.', 3),
('Tempo Traveller 10', 10, 3000, '₹8/km', '10-seater tempo traveller for comfortable group travel.', 4),
('Tempo Traveller 17 (A)', 17, 3600, '₹6/km', 'Large 17-seater for big family groups and tours.', 5),
('Tempo Traveller 17 (B)', 17, 3600, '₹6/km', 'Premium 17-seater with reclining seats.', 6);

INSERT INTO public.site_settings (key, value) VALUES
('contact', '{"phones":["919492456488","9441805777","8099079719"],"email":"MNMTRAVELS6077@GMAIL.COM","whatsapp":"919492456488","address":"12/80 Main Bazar Road, Opposite Hanuman Statue, Tadipatri - 515411, ANANTAPUR (DIST) AP"}'::jsonb),
('payment', '{"upi_id":"mnmtravels@upi","qr_image":"","cod_enabled":true,"note":"Pay via UPI / Scan QR / Cash on Delivery. Confirm payment via WhatsApp."}'::jsonb),
('hero', '{"title":"Travel in Comfort","subtitle":"Premium Vehicle Rentals across India","tagline":"Welcome to MNM Travels"}'::jsonb);
