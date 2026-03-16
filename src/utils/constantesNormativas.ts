// ============================================================
// CONSTANTES NORMATIVAS — Decreto 170 / Ley 20.903
// ============================================================

export const HORAS_NEET_JEC = {
  docente:    6.0,
  asistente:  4.0,
} as const;

export const HORAS_NEET_SIN_JEC = {
  docente:    4.5,
  asistente:  2.5,
} as const;

export const HORAS_NEEP_POR_ALUMNO = {
  docente:    2.25,
  asistente:  0.75,
} as const;

export const HORAS_COORDINACION_POR_CURSO = 2.0;

// Costo de abrir 1 curso nuevo tipo (JEC, 5 NEET, 2 NEEP)
export const COSTO_CURSO_NUEVO = {
  docente:       6.0 + (2 * 2.25),  // = 10.5 hrs
  coordinacion:  2.0,
} as const;

// Factor Ley 20.903: horas de apoyo = contrato * 0.6477
export const FACTOR_HORAS_APOYO = 0.6477;

// Topes normativos por curso
export const TOPE_NEET_POR_CURSO = 5;
export const TOPE_NEEP_NORMAL    = 2; // Sobre esto requiere gestión ministerial
