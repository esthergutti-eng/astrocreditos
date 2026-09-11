CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  birth_date DATE,
  birth_time TIME,
  birth_place TEXT,
  credits_balance INTEGER NOT NULL DEFAULT 0 CHECK (credits_balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT profiles_id_neon_auth_fk FOREIGN KEY (id) REFERENCES neon_auth.user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.credit_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  credits INTEGER NOT NULL CHECK (credits > 0),
  price_usd NUMERIC(10,2) NOT NULL CHECK (price_usd > 0),
  stripe_payment_link TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.credit_packages(id),
  amount_usd NUMERIC(10,2) NOT NULL,
  credits_purchased INTEGER NOT NULL,
  stripe_session_id TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pending','completed','failed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('purchase','consumption','refund')),
  amount INTEGER NOT NULL,
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.study_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL CHECK (code IN ('carta_natal','sinastria','revolucion_solar')),
  name TEXT NOT NULL,
  description TEXT,
  credit_cost INTEGER NOT NULL DEFAULT 5 CHECK (credit_cost > 0)
);

CREATE TABLE IF NOT EXISTS public.studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  study_type_id UUID REFERENCES public.study_types(id),
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','completed','failed')) DEFAULT 'pending',
  input_data JSONB NOT NULL,
  result_data JSONB,
  credits_spent INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TODO: RLS se implementará en la Fase 7. Por ahora las tablas están sin políticas restrictivas (acceso solo desde backend/desarrollo).
COMMENT ON TABLE public.profiles IS 'TODO: RLS se implementará en Fase 7. Actualmente sin políticas restrictivas - acceso solo desde backend/desarrollo.';
COMMENT ON TABLE public.credit_packages IS 'TODO: RLS se implementará en Fase 7. Actualmente sin políticas restrictivas - acceso solo desde backend/desarrollo.';
COMMENT ON TABLE public.purchases IS 'TODO: RLS se implementará en Fase 7. Actualmente sin políticas restrictivas - acceso solo desde backend/desarrollo.';
COMMENT ON TABLE public.credit_transactions IS 'TODO: RLS se implementará en Fase 7. Actualmente sin políticas restrictivas - acceso solo desde backend/desarrollo.';
COMMENT ON TABLE public.study_types IS 'TODO: RLS se implementará en Fase 7. Actualmente sin políticas restrictivas - acceso solo desde backend/desarrollo.';
COMMENT ON TABLE public.studies IS 'TODO: RLS se implementará en Fase 7. Actualmente sin políticas restrictivas - acceso solo desde backend/desarrollo.';

INSERT INTO public.credit_packages (name, credits, price_usd, stripe_payment_link, sort_order)
VALUES
  ('Iniciación', 10, 10.00, 'https://buy.stripe.com/cNi4gzfxz02j59t0po2kw12', 1),
  ('Estándar', 20, 20.00, 'https://buy.stripe.com/cNi4gzfxz02j59t0po2kw12', 2),
  ('Premium', 50, 50.00, 'https://buy.stripe.com/cNi4gzfxz02j59t0po2kw12', 3)
ON CONFLICT DO NOTHING;

INSERT INTO public.study_types (code, name, description, credit_cost)
VALUES
  ('carta_natal', 'Carta astral', 'Conoce el mapa natal de una persona', 5),
  ('sinastria', 'Sinastría', 'Explora la conexión entre dos personas', 5),
  ('revolucion_solar', 'Revolución solar', 'Descubre la energía de un nuevo ciclo solar', 5)
ON CONFLICT (code) DO NOTHING;
