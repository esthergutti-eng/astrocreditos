-- AstroCréditos Fase 2: identidad compatible con el esquema Neon Auth de Fase 1.
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  name TEXT,
  google_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_id_users_fk') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_user_id_users_fk
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_id_unique') THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

COMMENT ON TABLE public.users IS 'Usuarios de NextAuth Fase 2. TODO: RLS se implementará en Fase 7.';
COMMENT ON COLUMN public.profiles.user_id IS 'Relación one-to-one opcional con public.users; se conserva profiles.id -> neon_auth.user(id) de Fase 1.';
COMMENT ON TABLE public.profiles IS 'TODO: RLS se implementará en la Fase 7. Sin políticas restrictivas por ahora; acceso solo desde backend/desarrollo.';

-- La FK histórica profiles.id -> neon_auth.user(id) se conserva intencionalmente.
-- Un perfil de NextAuth se enlaza cuando existe una identidad equivalente en Neon Auth.
-- No se activa RLS en esta fase.

CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (lower(email));
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles (user_id);
