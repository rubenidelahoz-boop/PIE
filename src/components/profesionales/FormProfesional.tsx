'use client';
import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import type { Profesional, Rol } from '@/types';
import { calcularHorasApoyoSugeridas } from '@/utils/motorCalculo';

const ROLES: Rol[] = [
  'Educadora Diferencial',
  'Psicóloga',
  'Fonoaudióloga',
  'Coordinador/a',
];

interface Props {
  initial?: Partial<Profesional>;
  onSubmit: (data: Omit<Profesional,'id'|'createdAt'|'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

export default function FormProfesional({ initial = {}, onSubmit, onCancel }: Props) {
  const [nombre,        setNombre]        = useState(initial.nombre        ?? '');
  const [rol,           setRol]           = useState<Rol>(initial.rol       ?? 'Educadora Diferencial');
  const [horasContrato, setHorasContrato] = useState(initial.horasContrato ?? 44);
  const [horasApoyo,    setHorasApoyo]    = useState(initial.horasApoyo    ?? 28.5);
  const [sugerido,      setSugerido]      = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');

  // Auto-sugerencia Ley 20.903 al cambiar horas contrato
  useEffect(() => {
    if (!initial.horasApoyo) {
      const sug = calcularHorasApoyoSugeridas(horasContrato);
      setHorasApoyo(sug);
      setSugerido(true);
    }
  }, [horasContrato, initial.horasApoyo]);

  const handleContrato = (v: number) => {
    setHorasContrato(v);
    // Recalcular sugerencia
    const sug = calcularHorasApoyoSugeridas(v);
    setHorasApoyo(sug);
    setSugerido(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) { setError('El nombre es obligatorio'); return; }
    if (horasApoyo > horasContrato) { setError('Las horas de apoyo no pueden superar las de contrato'); return; }
    setLoading(true);
    try {
      await onSubmit({ nombre: nombre.trim(), rol, horasContrato, horasApoyo });
    } catch {
      setError('Error al guardar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2
    text-white text-sm placeholder:text-slate-500 focus:outline-none
    focus:border-indigo-500 transition-colors`;

  const rolInfo: Record<Rol, string> = {
    'Educadora Diferencial': 'teacher — Horas docentes',
    'Psicóloga':             'assistant — Horas asistentes',
    'Fonoaudióloga':         'assistant — Horas asistentes',
    'Coordinador/a':         'coordinator — Horas coordinación',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-red-400 text-xs bg-red-900/30 border border-red-800 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div>
        <label className="block text-xs text-slate-400 mb-1.5">Nombre completo *</label>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
          placeholder="Ej: María González" className={inputCls} />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1.5">Rol</label>
        <select value={rol} onChange={e => setRol(e.target.value as Rol)} className={inputCls}>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <p className="text-xs text-slate-500 mt-1">{rolInfo[rol]}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Hrs. Contrato</label>
          <input type="number" min={1} max={44} value={horasContrato}
            onChange={e => handleContrato(+e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5 flex items-center gap-1">
            Hrs. Apoyo PIE
            {sugerido && (
              <span className="text-indigo-400 text-[10px] font-medium">AUTO</span>
            )}
          </label>
          <input type="number" min={1} max={horasContrato} step={0.5}
            value={horasApoyo}
            onChange={e => { setHorasApoyo(+e.target.value); setSugerido(false); }}
            className={inputCls} />
        </div>
      </div>

      {/* Info Ley 20.903 */}
      <div className="flex items-start gap-2 bg-indigo-900/20 border border-indigo-800/40 rounded-lg p-3">
        <Info size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-400">
          <span className="text-indigo-300 font-medium">Ley 20.903:</span> Las horas de apoyo se sugieren
          como el {(0.6477*100).toFixed(1)}% del contrato ({horasContrato}h × 0.6477 ={' '}
          <span className="text-white">{calcularHorasApoyoSugeridas(horasContrato)}h</span>).
          Puedes editarlo manualmente.
        </p>
      </div>

      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 px-4 py-2 text-sm text-slate-400 border border-slate-700
            rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600
            rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-colors">
          {loading ? 'Guardando…' : 'Guardar profesional'}
        </button>
      </div>
    </form>
  );
}
