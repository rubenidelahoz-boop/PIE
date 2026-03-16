-- ============================================================
-- DASHBOARD PIE — Schema Supabase
-- Pega TODO este archivo en:
-- Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

CREATE TABLE IF NOT EXISTS cursos (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        TEXT        NOT NULL,
  cantidad_neep INTEGER     NOT NULL DEFAULT 0 CHECK (cantidad_neep >= 0),
  cantidad_neet INTEGER     NOT NULL DEFAULT 0 CHECK (cantidad_neet >= 0),
  tiene_jec     BOOLEAN     NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE IF NOT EXISTS rol_pie AS ENUM (
  'Educadora Diferencial',
  'Psicóloga',
  'Fonoaudióloga',
  'Coordinador/a'
);

CREATE TABLE IF NOT EXISTS profesionales (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          TEXT        NOT NULL,
  rol             rol_pie     NOT NULL,
  horas_contrato  INTEGER     NOT NULL DEFAULT 44 CHECK (horas_contrato > 0 AND horas_contrato <= 44),
  horas_apoyo     INTEGER     NOT NULL DEFAULT 32 CHECK (horas_apoyo > 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT horas_apoyo_validas CHECK (horas_apoyo <= horas_contrato)
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cursos_updated_at
  BEFORE UPDATE ON cursos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profesionales_updated_at
  BEFORE UPDATE ON profesionales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER PUBLICATION supabase_realtime ADD TABLE cursos;
ALTER PUBLICATION supabase_realtime ADD TABLE profesionales;

ALTER TABLE cursos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "acceso_publico_cursos"
  ON cursos FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "acceso_publico_profesionales"
  ON profesionales FOR ALL USING (true) WITH CHECK (true);

INSERT INTO cursos (nombre, cantidad_neep, cantidad_neet, tiene_jec) VALUES
  ('1° A Básico', 5, 3, true),
  ('2° B Básico', 4, 2, true),
  ('3° A Básico', 5, 3, false),
  ('4° B Básico', 4, 2, true),
  ('5° A Básico', 5, 2, true),
  ('6° A Básico', 5, 2, false);

INSERT INTO profesionales (nombre, rol, horas_contrato, horas_apoyo) VALUES
  ('Ana García', 'Educadora Diferencial', 44, 40),
  ('Luis Pérez',  'Psicóloga',            22, 20),
  ('Carla Ruiz',  'Fonoaudióloga',        22, 20),
  ('Marta Soto',  'Coordinador/a',        22, 22);
