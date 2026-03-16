export type RolType = 'teacher' | 'assistant' | 'coordinator';

export type Rol =
  | 'Educadora Diferencial'
  | 'Psicóloga'
  | 'Fonoaudióloga'
  | 'Coordinador/a';

export const ROL_TO_TYPE: Record<Rol, RolType> = {
  'Educadora Diferencial': 'teacher',
  'Psicóloga':             'assistant',
  'Fonoaudióloga':         'assistant',
  'Coordinador/a':         'coordinator',
};

export interface Curso {
  id:           string;
  nombre:       string;
  cantidadNEEP: number;
  cantidadNEET: number;
  tieneJEC:     boolean;
  createdAt:    string;
  updatedAt:    string;
}

export interface Profesional {
  id:            string;
  nombre:        string;
  rol:           Rol;
  horasContrato: number;
  horasApoyo:    number;
  createdAt:     string;
  updatedAt:     string;
}

export interface HorasRequeridas {
  docente:      number;
  asistente:    number;
  coordinacion: number;
}

export interface HorasDisponibles {
  docente:      number;
  asistente:    number;
  coordinacion: number;
}

export interface Balances {
  docente:      number;
  asistente:    number;
  coordinacion: number;
}

export interface Proyeccion {
  cursosPosiblesPorDocente: number;
  cursosPosiblesPorCoord:   number;
  cursosNuevosMaximos:      number;
}

export interface AlertaCurso {
  cursoId:  string;
  nombre:   string;
  tipo:     'warning' | 'error';
  mensaje:  string;
}

export interface AlertaGlobal {
  tipo:   'critica' | 'warning' | 'ok';
  campo:  'docente' | 'asistente' | 'coordinacion';
  mensaje: string;
}

export interface MetricasPIE {
  requeridas:       HorasRequeridas;
  disponibles:      HorasDisponibles;
  balances:         Balances;
  proyeccion:       Proyeccion;
  alertasCursos:    AlertaCurso[];
  alertasGlobales:  AlertaGlobal[];
  totalEstudiantes: number;
  totalNEEP:        number;
  totalNEET:        number;
}

export interface AnalisisHoras {
  horasDocentesRequeridas:    number;
  horasDocentesDisponibles:   number;
  horasAsistentesRequeridas:  number;
  horasAsistentesDisponibles: number;
  balanceDocente:             number;
  balanceAsistente:           number;
}
