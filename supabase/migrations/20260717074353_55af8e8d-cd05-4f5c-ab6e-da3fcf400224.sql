
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- updated_at trigger fn
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- user_roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- reservations
CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  party_size integer NOT NULL,
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  occasion text,
  special_requests text,
  status public.reservation_status NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reservations_name_len CHECK (char_length(name) BETWEEN 1 AND 120),
  CONSTRAINT reservations_email_len CHECK (char_length(email) BETWEEN 3 AND 255),
  CONSTRAINT reservations_phone_len CHECK (char_length(phone) BETWEEN 5 AND 32),
  CONSTRAINT reservations_party_size_range CHECK (party_size BETWEEN 1 AND 20),
  CONSTRAINT reservations_occasion_len CHECK (occasion IS NULL OR char_length(occasion) <= 60),
  CONSTRAINT reservations_special_len CHECK (special_requests IS NULL OR char_length(special_requests) <= 1000),
  CONSTRAINT reservations_notes_len CHECK (admin_notes IS NULL OR char_length(admin_notes) <= 2000)
);

GRANT INSERT ON public.reservations TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.reservations TO authenticated;
GRANT ALL ON public.reservations TO service_role;

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Anyone can create a reservation
CREATE POLICY "Anyone can create a reservation"
ON public.reservations FOR INSERT TO anon, authenticated
WITH CHECK (status = 'pending' AND admin_notes IS NULL);

-- Only admins can read
CREATE POLICY "Admins can view reservations"
ON public.reservations FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins can update reservations"
ON public.reservations FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete reservations"
ON public.reservations FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX reservations_date_idx ON public.reservations (reservation_date DESC, reservation_time DESC);
CREATE INDEX reservations_status_idx ON public.reservations (status);
