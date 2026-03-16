'use client';
import { useState }          from 'react';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { usePieData }        from '@/hooks/usePieData';
import Modal                 from '@/components/ui/Modal';
import Toast                 from '@/components/ui/Toast';
import Spinner               from '@/components/ui/Spinner';
import FormProfesional       from '@/components/profesionales/FormProfesional';
import type { Profesional }  from '@/types';

const rolColor: Record<string, string> = {
  'Educadora Diferencial': 'bg-indigo-900/50 text-indigo-400',
  'Psicóloga':             'bg-purple-900/50 text-purple-400',
  'Fonoaudióloga':         'bg-cyan-900/50 text-cyan-400',
  'Coordinador/a':         'bg-amber-900/50 text-amber-400',
};

export default function ProfesionalesPage() {
  const { profesionales, loading, addProfesional, updateProfesional, deleteProfesional } = usePieData();
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState<Profesional | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [toast,      setToast]      = useState<{ msg: string; type: 'success'|'error'|'info' } | null>(null);

  const totalDocHrs = profesionales
    .filter(p => p.rol === 'Educadora Diferencial' || p.rol === 'Coordinador/a')
    .reduce((s, p) => s + p.horasApoyo, 0);
  const totalAsiHrs = profesionales
    .filter(p => p.rol !== 'Educadora Diferencial' && p.rol !== 'Coordinador/a')
    .reduce((s, p) => s + p.horasApoyo, 0);

  const handleAdd = async (data: Omit<Profesional,'id'|'createdAt'|'updatedAt'>) => {
    await addProfesional(data);
    setModalOpen(false);
    setToast({ msg: '✅ Profesional agregado', type: 'success' });
  };

  const handleEdit = async (data: Omit<Profesional,'id'|'createdAt'|'updatedAt'>) => {
    if (!editTarget) return;
    await updateProfesional(editTarget.id, data);
    setEditTarget(null);
    setToast({ msg: '✅ Profesional actualizado', type: 'success' });
  };

  const handleDelete = async (id: string) => {
    await deleteProfesional(id);
    setConfirmDel(null);
    setToast({ msg: '🗑 Profesional eliminado', type: 'info' });
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-indigo-400" size={24} />
            Profesionales PIE
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {profesionales.length} profesionales · {totalDocHrs}h docentes · {totalAsiHrs}h asistentes
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500
            text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus size={16} />
          Agregar profesional
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Horas docentes disponibles</p>
          <p className="text-2xl font-bold text-indigo-400">{totalDocHrs}h</p>
          <p className="text-xs text-slate-500 mt-1">Educadoras + Coordinadores</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Horas asistentes disponibles</p>
          <p className="text-2xl font-bold text-cyan-400">{totalAsiHrs}h</p>
          <p className="text-xs text-slate-500 mt-1">Psicólogas + Fonoaudiólogas</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs">
              <th className="text-left px-4 py-3 font-medium">Nombre</th>
              <th className="text-left px-3 py-3 font-medium">Rol</th>
              <th className="text-center px-3 py-3 font-medium">Contrato</th>
              <th className="text-center px-3 py-3 font-medium">Apoyo PIE</th>
              <th className="text-center px-3 py-3 font-medium">Tipo hrs.</th>
              <th className="text-right px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profesionales.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-slate-500 py-12 text-sm">
                  No hay profesionales registrados. Agrega el primero.
                </td>
              </tr>
            ) : (
              profesionales.map(p => {
                const esDoc = p.rol === 'Educadora Diferencial' || p.rol === 'Coordinador/a';
                return (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{p.nombre}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${rolColor[p.rol]}`}>
                        {p.rol}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-slate-300">{p.horasContrato}h</td>
                    <td className="px-3 py-3 text-center text-slate-300 font-medium">{p.horasApoyo}h</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`text-xs ${esDoc ? 'text-indigo-400' : 'text-cyan-400'}`}>
                        {esDoc ? 'Docente' : 'Asistente'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditTarget(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDel(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Agregar profesional">
        <FormProfesional onSubmit={handleAdd} onCancel={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Editar profesional">
        {editTarget && (
          <FormProfesional
            initial={editTarget}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="Confirmar eliminación">
        <p className="text-slate-300 text-sm mb-5">
          ¿Estás seguro de que quieres eliminar este profesional? Esta acción no se puede deshacer.
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
