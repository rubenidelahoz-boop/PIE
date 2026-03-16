// Tipos generados a partir del schema de Supabase
// Reflejan exactamente las tablas del archivo schema.sql

export type RolPie =
  | 'Educadora Diferencial'
  | 'Psicóloga'
  | 'Fonoaudióloga'
  | 'Coordinador/a';

export interface Database {
  public: {
    Tables: {
      cursos: {
        Row: {
          id:            string;
          nombre:        string;
          cantidad_neep: number;
          cantidad_neet: number;
          tiene_jec:     boolean;
          created_at:    string;
          updated_at:    string;
        };
        Insert: {
          id?:           string;
          nombre:        string;
          cantidad_neep: number;
          cantidad_neet: number;
          tiene_jec:     boolean;
          created_at?:   string;
          updated_at?:   string;
        };
        Update: Partial<Database['public']['Tables']['cursos']['Insert']>;
      };
      profesionales: {
        Row: {
          id:             string;
          nombre:         string;
          rol:            RolPie;
          horas_contrato: number;
          horas_apoyo:    number;
          created_at:     string;
          updated_at:     string;
        };
        Insert: {
          id?:            string;
          nombre:         string;
          rol:            RolPie;
          horas_contrato: number;
          horas_apoyo:    number;
          created_at?:    string;
          updated_at?:    string;
        };
        Update: Partial<Database['public']['Tables']['profesionales']['Insert']>;
      };
    };
  };
}
