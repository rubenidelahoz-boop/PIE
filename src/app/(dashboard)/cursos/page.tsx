'use client';
import { useState } from 'react';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { usePieData }    from '@/hooks/usePieData';
import { calcularHoras } from '@/utils/calcularHoras';
import Modal             from '@/components/ui/Modal';
import Toast             from '@/components/ui/Toast';
import Spinner           from '@/components/ui/Spinner';
import FormCurso         from '@/components/cursos/FormCurso';
import type { Curso }    from '@/types';

export default function CursosPage() {
  const { cursos, profesionales, loading, addCurso, updateCurso, deleteCurso } = usePieData();
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editTarget,   setEditTarget]   = useState<Curso | null>(null);
  const [toast,        setToast]        = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null);
  const [confirmDel,   setConfirmDel]   = useState<string | null>(null);

  const analisis = calcularHoras(cursos, profesionales);

  const horasDoc = (c: Curso) => {
    const hNEET = c.tieneJEC ? 6 : 4.5;
    return c.cantidadNEEP * 2.25 + c.cantidadNEET * hNEET + 2;
  };

  const handleAdd = async (data: Omit<Curso, 'id'|'createdAt'|'updatedAt'>) => {
    await addCurso(data);
    setModalOpen(false);
    setToast({ msg: '✅ Curso agregado correctamente', type: 'success' });
  };

  const handleEdit = async (data: Omit<Curso, 'id'|'createdAt'|'updatedAt'>) => {
    if (!editTarget) return;
    await updateCurso(editTarget.id, data);
    setEditTarget(null);
    setToast({ msg: '✅ Curso actualizado', type: 'success' });
  };

  const handleDelete = async (id: string) => {
    await deleteCurso(id);
    setConfirmDel(null);
    setToast({ msg: '🗑 Curso eliminado', type: 'info' });
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-indigo-400" size={24} />
            Gestión de Cursos
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {cursos.length} cursos · {cursos.reduce((s,c)=>s+c.cantidadNEEP+c.cantidadNEET,0)} estudiantes totales
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500
            text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus size={16} />
          Agregar curso
        </button>
      </div>

      {/* Resumen horas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Horas docentes requeridas</p>
          <p className="text-2xl font-bold text-white">{analisis.horasDocentesRequeridas.toFixed(1)}h</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Horas asistentes requeridas</p>
          <p className="text-2xl font-bold text-white">{analisis.horasAsistentesRequeridas.toFixed(1)}h</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs">
              <th className="text-left px-4 py-3 font-medium">Curso</th>
              <th className="text-center px-3 py-3 font-medium">NEEP</th>
              <th className="text-center px-3 py-3 font-medium">NEET</th>
              <th className="text-center px-3 py-3 font-medium">Total</th>
              <th className="text-center px-3 py-3 font-medium">JEC</th>
              <th className="text-right px-3 py-3 font-medium">Hrs. doc.</th>
              <th className="text-right px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-slate-500 py-12 text-sm">
                  No hay cursos registrados. Agrega el primero.
                </td>
              </tr>
            ) : (
              cursos.map(c => (
                <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{c.nombre}</td>
                  <td className="px-3 py-3 text-center text-slate-300">{c.cantidadNEEP}</td>
                  <td className="px-3 py-3 text-center text-slate-300">{c.cantidadNEET}</td>
                  <td className="px-3 py-3 text-center text-slate-300 font-medium">{c.cantidadNEEP + c.cantidadNEET}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium
                      ${c.tieneJEC ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {c.tieneJEC ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-slate-300">{horasDoc(c).toFixed(1)}h</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditTarget(c)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setConfirmDel(c.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Agregar curso">
        <FormCurso onSubmit={handleAdd} onCancel={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Editar curso">
        {editTarget && (
          <FormCurso
            initial={editTarget}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="Confirmar eliminación">
        <p className="text-slate-300 text-sm mb-5">
          ¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setConfirmDel(null)}
            className="flex-1 px-4 py-2 text-sm text-slate-400 border border-slate-700 rounded-xl
              hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => confirmDel && handleDelete(confirmDel)}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600
              rounded-xl hover:bg-red-500 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
