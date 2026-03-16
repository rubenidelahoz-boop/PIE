'use client';
import { useState } from 'react';
import type { Curso } from '@/types';

interface Props {
  initial?: Partial<Curso>;
  onSubmit: (data: Omit<Curso, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

export default function FormCurso({ initial = {}, onSubmit, onCancel }: Props) {
  const [nombre,        setNombre]        = useState(initial.nombre        ?? '');
  const [cantidadNEEP,  setCantidadNEEP]  = useState(initial.cantidadNEEP  ?? 0);
  const [cantidadNEET,  setCantidadNEET]  = useState(initial.cantidadNEET  ?? 0);
  const [tieneJEC,      setTieneJEC]      = useState(initial.tieneJEC      ?? true);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) { setError('El nombre es obligatorio'); return; }
    setLoading(true);
    try {
      await onSubmit({ nombre: nombre.trim(), cantidadNEEP, cantidadNEET, tieneJEC });
    } catch {
      setError('Error al guardar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2
    text-white text-sm placeholder:text-slate-500 focus:outline-none
    focus:border-indigo-500 transition-colors`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-red-400 text-xs bg-red-900/30 border border-red-800 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div>
        <label className="block text-xs text-slate-400 mb-1.5">Nombre del curso *</label>
        <input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Ej: 1° A Básico"
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Cant. NEEP</label>
          <input
            type="number" min={0} max={50}
            value={cantidadNEEP}
            onChange={e => setCantidadNEEP(+e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Cant. NEET</label>
          <input
            type="number" min={0} max={50}
            value={cantidadNEET}
            onChange={e => setCantidadNEET(+e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1.5">Jornada Escolar Completa (JEC)</label>
        <select
          value={tieneJEC ? 'si' : 'no'}
          onChange={e => setTieneJEC(e.target.value === 'si')}
          className={inputCls}
        >
          <option value="si">Sí — tiene JEC (6h doc / 4h asist por NEET)</option>
          <option value="no">No — sin JEC (4.5h doc / 2.5h asist por NEET)</option>
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button" onClick={onCancel}
          className="flex-1 px-4 py-2 text-sm text-slate-400 border border-slate-700
            rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit" disabled={loading}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600
            rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Guardando…' : 'Guardar curso'}
        </button>
      </div>
    </form>
  );
}
