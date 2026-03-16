// ============================================================
// MOTOR DE CÁLCULO PIE — Decreto 170 / Ley 20.903
// ============================================================
import {
  HORAS_NEET_JEC,
  HORAS_NEET_SIN_JEC,
  HORAS_NEEP_POR_ALUMNO,
  HORAS_COORDINACION_POR_CURSO,
  COSTO_CURSO_NUEVO,
  TOPE_NEET_POR_CURSO,
  TOPE_NEEP_NORMAL,
} from './constantesNormativas';
import { ROL_TO_TYPE } from '@/types';
import type {
  Curso, Profesional, MetricasPIE,
  HorasRequeridas, HorasDisponibles,
  Balances, Proyeccion, AlertaCurso, AlertaGlobal,
} from '@/types';

// ── PASO A: Horas Requeridas (la demanda) ─────────────────────────────────────
function calcularRequeridas(cursos: Curso[]): HorasRequeridas {
  let docente      = 0;
  let asistente    = 0;
  const coordinacion = cursos.length * HORAS_COORDINACION_POR_CURSO;

  for (const curso of cursos) {
    const horasNEET = curso.tieneJEC ? HORAS_NEET_JEC : HORAS_NEET_SIN_JEC;

    // NEET: cálculo por curso (sólo si hay alumnos NEET)
    if (curso.cantidadNEET > 0) {
      docente   += horasNEET.docente;
      asistente += horasNEET.asistente;
    }

    // NEEP: cálculo por alumno
    docente   += curso.cantidadNEEP * HORAS_NEEP_POR_ALUMNO.docente;
    asistente += curso.cantidadNEEP * HORAS_NEEP_POR_ALUMNO.asistente;
  }

  return { docente, asistente, coordinacion };
}

// ── PASO B: Horas Disponibles (la oferta) ────────────────────────────────────
function calcularDisponibles(profesionales: Profesional[]): HorasDisponibles {
  let docente      = 0;
  let asistente    = 0;
  let coordinacion = 0;

  for (const prof of profesionales) {
    const tipo = ROL_TO_TYPE[prof.rol];
    if (tipo === 'teacher')     docente      += prof.horasApoyo;
    if (tipo === 'assistant')   asistente    += prof.horasApoyo;
    if (tipo === 'coordinator') coordinacion += prof.horasApoyo;
  }

  return { docente, asistente, coordinacion };
}

// ── PASO C: Balances (superávit / déficit) ───────────────────────────────────
function calcularBalances(
  disponibles: HorasDisponibles,
  requeridas:  HorasRequeridas
): Balances {
  return {
    docente:      disponibles.docente      - requeridas.docente,
    asistente:    disponibles.asistente    - requeridas.asistente,
    coordinacion: disponibles.coordinacion - requeridas.coordinacion,
  };
}

// ── PASO D: Proyección de crecimiento ────────────────────────────────────────
function calcularProyeccion(balances: Balances): Proyeccion {
  const cursosPosiblesPorDocente = balances.docente > 0
    ? Math.floor(balances.docente / COSTO_CURSO_NUEVO.docente)
    : 0;

  const cursosPosiblesPorCoord = balances.coordinacion > 0
    ? Math.floor(balances.coordinacion / COSTO_CURSO_NUEVO.coordinacion)
    : 0;

  // El recurso más escaso limita el crecimiento
  const cursosNuevosMaximos = Math.min(
    cursosPosiblesPorDocente,
    cursosPosiblesPorCoord
  );

  return { cursosPosiblesPorDocente, cursosPosiblesPorCoord, cursosNuevosMaximos };
}

// ── Alertas por curso ─────────────────────────────────────────────────────────
function calcularAlertasCursos(cursos: Curso[]): AlertaCurso[] {
  const alertas: AlertaCurso[] = [];

  for (const curso of cursos) {
    if (curso.cantidadNEET > TOPE_NEET_POR_CURSO) {
      alertas.push({
        cursoId: curso.id,
        nombre:  curso.nombre,
        tipo:    'warning',
        mensaje: `Excede tope de ${TOPE_NEET_POR_CURSO} NEET por curso (Subvención regular)`,
      });
    }
    if (curso.cantidadNEEP > TOPE_NEEP_NORMAL) {
      alertas.push({
        cursoId: curso.id,
        nombre:  curso.nombre,
        tipo:    'warning',
        mensaje: `Sobre ${TOPE_NEEP_NORMAL} NEEP requiere gestión vía Período Excepcional Ministerial`,
      });
    }
  }

  return alertas;
}

// ── Alertas globales ──────────────────────────────────────────────────────────
function calcularAlertasGlobales(balances: Balances): AlertaGlobal[] {
  const alertas: AlertaGlobal[] = [];

  if (balances.docente < 0) {
    alertas.push({
      tipo:    'critica',
      campo:   'docente',
      mensaje: `Déficit de ${Math.abs(balances.docente).toFixed(1)}h docentes. No se cumple la normativa`,
    });
  } else {
    alertas.push({
      tipo:    'ok',
      campo:   'docente',
      mensaje: `Superávit de ${balances.docente.toFixed(1)}h docentes`,
    });
  }

  if (balances.asistente < 0) {
    alertas.push({
      tipo:    'critica',
      campo:   'asistente',
      mensaje: `Déficit de ${Math.abs(balances.asistente).toFixed(1)}h asistentes. No se cumple la normativa`,
    });
  } else {
    alertas.push({
      tipo:    'ok',
      campo:   'asistente',
      mensaje: `Superávit de ${balances.asistente.toFixed(1)}h asistentes`,
    });
  }

  if (balances.coordinacion < 0) {
    alertas.push({
      tipo:    'critica',
      campo:   'coordinacion',
      mensaje: `Déficit de ${Math.abs(balances.coordinacion).toFixed(1)}h coordinación`,
    });
  } else {
    alertas.push({
      tipo:    'ok',
      campo:   'coordinacion',
      mensaje: `Superávit de ${balances.coordinacion.toFixed(1)}h coordinación`,
    });
  }

  return alertas;
}

// ── FUNCIÓN PRINCIPAL ─────────────────────────────────────────────────────────
export function calcularMetricasPIE(
  cursos:        Curso[],
  profesionales: Profesional[]
): MetricasPIE {
  const requeridas  = calcularRequeridas(cursos);
  const disponibles = calcularDisponibles(profesionales);
  const balances    = calcularBalances(disponibles, requeridas);
  const proyeccion  = calcularProyeccion(balances);

  const alertasCursos   = calcularAlertasCursos(cursos);
  const alertasGlobales = calcularAlertasGlobales(balances);

  const totalNEEP = cursos.reduce((s, c) => s + c.cantidadNEEP, 0);
  const totalNEET = cursos.reduce((s, c) => s + c.cantidadNEET, 0);

  return {
    requeridas,
    disponibles,
    balances,
    proyeccion,
    alertasCursos,
    alertasGlobales,
    totalEstudiantes: totalNEEP + totalNEET,
    totalNEEP,
    totalNEET,
  };
}

// ── Helper: auto-sugerencia horas apoyo (Ley 20.903) ─────────────────────────
export function calcularHorasApoyoSugeridas(horasContrato: number): number {
  return Math.round(horasContrato * 0.6477 * 10) / 10;
}

// ── Helper legacy para compatibilidad ────────────────────────────────────────
export function calcularHoras(cursos: Curso[], profesionales: Profesional[]) {
  const m = calcularMetricasPIE(cursos, profesionales);
  return {
    horasDocentesRequeridas:    m.requeridas.docente,
    horasDocentesDisponibles:   m.disponibles.docente,
    horasAsistentesRequeridas:  m.requeridas.asistente,
    horasAsistentesDisponibles: m.disponibles.asistente,
    balanceDocente:             m.balances.docente,
    balanceAsistente:           m.balances.asistente,
  };
}
