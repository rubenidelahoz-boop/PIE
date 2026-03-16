import * as XLSX from 'xlsx';
import type { Curso, Profesional, AnalisisHoras } from '@/types';

export function exportarExcel(
  cursos: Curso[],
  profesionales: Profesional[],
  analisis: AnalisisHoras
) {
  const wb = XLSX.utils.book_new();

  const wsCursos = XLSX.utils.json_to_sheet(
    cursos.map(c => ({
      Nombre:      c.nombre,
      NEEP:        c.cantidadNEEP,
      NEET:        c.cantidadNEET,
      Total:       c.cantidadNEEP + c.cantidadNEET,
      'Tiene JEC': c.tieneJEC ? 'Sí' : 'No',
    }))
  );
  XLSX.utils.book_append_sheet(wb, wsCursos, 'Cursos');

  const wsProfs = XLSX.utils.json_to_sheet(
    profesionales.map(p => ({
      Nombre:           p.nombre,
      Rol:              p.rol,
      'Hrs. Contrato':  p.horasContrato,
      'Hrs. Apoyo':     p.horasApoyo,
    }))
  );
  XLSX.utils.book_append_sheet(wb, wsProfs, 'Profesionales');

  const wsAnalisis = XLSX.utils.json_to_sheet([
    { Concepto: 'Horas Docentes Requeridas',   Valor: analisis.horasDocentesRequeridas },
    { Concepto: 'Horas Docentes Disponibles',  Valor: analisis.horasDocentesDisponibles },
    { Concepto: 'Balance Docente',             Valor: analisis.balanceDocente },
    { Concepto: 'Horas Asistente Requeridas',  Valor: analisis.horasAsistentesRequeridas },
    { Concepto: 'Horas Asistente Disponibles', Valor: analisis.horasAsistentesDisponibles },
    { Concepto: 'Balance Asistente',           Valor: analisis.balanceAsistente },
  ]);
  XLSX.utils.book_append_sheet(wb, wsAnalisis, 'Análisis de Horas');

  XLSX.writeFile(wb, `informe-PIE-${new Date().toISOString().slice(0,10)}.xlsx`);
}
