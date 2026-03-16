'use client';
import { useState }             from 'react';
import { FileSpreadsheet, Download, Mail, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { usePieData }           from '@/hooks/usePieData';
import { calcularMetricasPIE }  from '@/utils/motorCalculo';
import { exportarExcel }        from '@/utils/exportarExcel';
import { enviarCorreoPIE }      from '@/utils/enviarCorreo';
import Modal                    from '@/components/ui/Modal';
import Toast                    from '@/components/ui/Toast';
import Spinner                  from '@/components/ui/Spinner';

export default function ReportesPage() {
  const { cursos, profesionales, loading } = usePieData();
  const [emailModal, setEmailModal] = useState(false);
  const [email,      setEmail]      = useState('');
  const [estab,      setEstab]      = useState('');
  const [sending,    setSending]    = useState(false);
  const [toast, setToast] = useState<{msg:string;type:'success'|'error'|'info'}|null>(null);

  if (loading) return <Spinner />;

  const m       = calcularMetricasPIE(cursos, profesionales);
  const signo   = (n: number) => n >= 0 ? `+${n.toFixed(1)}` : n.toFixed(1);
  const colorB  = (n: number) => n >= 0 ? 'text-emerald-400' : 'text-red-400';

  const handleExport = () => {
    const analisis = {
      horasDocentesRequeridas:    m.requeridas.docente,
      horasDocentesDisponibles:   m.disponibles.docente,
      horasAsistentesRequeridas:  m.requeridas.asistente,
      horasAsistentesDisponibles: m.disponibles.asistente,
      balanceDocente:             m.balances.docente,
      balanceAsistente:           m.balances.asistente,
    };
    exportarExcel(cursos, profesionales, analisis);
    setToast({ msg: '📥 Excel descargado', type: 'success' });
  };

  const handleSendEmail = async () => {
    if (!email) { setToast({ msg: '⚠ Ingresa un correo', type: 'error' }); return; }
    setSending(true);
    try {
      await enviarCorreoPIE({
        destinatario: email, establecimiento: estab || 'Establecimiento PIE',
        balanceDocente: m.balances.docente, balanceAsistente: m.balances.asistente,
        totalEstudiantes: m.totalEstudiantes,
      });
      setEmailModal(false);
      setToast({ msg: `✉️ Correo enviado a ${email}`, type: 'success' });
    } catch {
      setToast({ msg: '❌ Error al enviar. Verifica configuración EmailJS.', type: 'error' });
    } finally { setSending(false); }
  };

  const inputCls = `w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2
    text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`;

  const rows = [
    { label: 'Horas docentes requeridas',      val: `${m.requeridas.docente.toFixed(1)} h`,      color: 'text-white' },
    { label: 'Horas docentes disponibles',     val: `${m.disponibles.docente} h`,                color: 'text-white' },
    { label: 'Balance docente',                val: `${signo(m.balances.docente)} h`,            color: colorB(m.balances.docente) },
    { label: 'Horas asistentes requeridas',    val: `${m.requeridas.asistente.toFixed(1)} h`,    color: 'text-white' },
    { label: 'Horas asistentes disponibles',   val: `${m.disponibles.asistente} h`,              color: 'text-white' },
    { label: 'Balance asistente',              val: `${signo(m.balances.asistente)} h`,          color: colorB(m.balances.asistente) },
    { label: 'Horas coordinación requeridas',  val: `${m.requeridas.coordinacion.toFixed(1)} h`, color: 'text-white' },
    { label: 'Horas coordinación disponibles', val: `${m.disponibles.coordinacion} h`,           color: 'text-white' },
    { label: 'Balance coordinación',           val: `${signo(m.balances.coordinacion)} h`,       color: colorB(m.balances.coordinacion) },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileSpreadsheet className="text-indigo-400" size={24} />
          Reportes y Exportación
        </h1>
        <p className="text-slate-400 text-sm mt-1">Análisis normativo completo — Decreto 170</p>
      </div>

      {/* Alertas globales */}
      <div className="space-y-2">
        {m.alertasGlobales.map((a, i) => (
          <div key={i} className={`flex items-center gap-3 rounded-xl px-4 py-3 border
            ${a.tipo === 'critica'
              ? 'bg-red-900/30 border-red-800'
              : 'bg-emerald-900/20 border-emerald-800/50'}`}>
            {a.tipo === 'critica'
              ? <AlertTriangle size={15} className="text-red-400 flex-shrink-0" />
              : <CheckCircle   size={15} className="text-emerald-400 flex-shrink-0" />}
            <p className={`text-sm ${a.tipo === 'critica' ? 'text-red-300' : 'text-emerald-300'}`}>
              {a.mensaje}
            </p>
          </div>
        ))}
      </div>

      {/* Alertas por curso */}
      {m.alertasCursos.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-3 text-sm">Alertas por Curso</h2>
          <div className="space-y-2">
            {m.alertasCursos.map((a, i) => (
              <div key={i} className="flex items-start gap-2 bg-amber-900/20 border border-amber-800/40 rounded-lg px-3 py-2">
                <AlertTriangle size={13} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-300">
                  <span className="font-medium">{a.nombre}:</span> {a.mensaje}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proyección */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-3 text-sm">Proyección de Crecimiento</h2>
        <p className="text-3xl font-bold text-indigo-400">{m.proyeccion.cursosNuevosMaximos} cursos</p>
        <p className="text-slate-400 text-xs mt-1 mb-3">nuevos posibles con el superávit actual</p>
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p>Por horas docentes</p>
            <p className="text-white font-medium text-base mt-1">{m.proyeccion.cursosPosiblesPorDocente}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p>Por coordinación</p>
            <p className="text-white font-medium text-base mt-1">{m.proyeccion.cursosPosiblesPorCoord}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">Modelo: JEC · 5 NEET · 2 NEEP · 10.5h doc · 2h coord por curso</p>
      </div>

      {/* Tabla análisis */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4 text-sm">Análisis Completo de Horas</h2>
        <div className="space-y-0">
          {rows.map((r, i) => (
            <div key={i} className={`flex justify-between py-2.5 text-sm
              ${i % 3 === 2 ? 'border-b border-slate-700 mb-1' : 'border-b border-slate-800/50'}`}>
              <span className="text-slate-400">{r.label}</span>
              <span className={`font-semibold ${r.color}`}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 text-sm">Resumen del Establecimiento</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Cursos',        val: cursos.length },
            { label: 'Estudiantes',   val: m.totalEstudiantes },
            { label: 'Profesionales', val: profesionales.length },
          ].map(s => (
            <div key={s.label} className="bg-slate-800/50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{s.val}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 text-sm">Acciones</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500
              text-white text-sm font-medium rounded-xl transition-colors">
            <Download size={16} />Exportar a Excel
          </button>
          <button onClick={() => setEmailModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700
              text-white text-sm font-medium rounded-xl border border-slate-700 transition-colors">
            <Mail size={16} />Enviar por Correo
          </button>
          <button onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700
              text-white text-sm font-medium rounded-xl border border-slate-700 transition-colors">
            <FileText size={16} />Imprimir Acta
          </button>
        </div>
      </div>

      <Modal open={emailModal} onClose={() => setEmailModal(false)} title="Enviar informe por correo">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Correo de destino *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="director@escuela.cl" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Nombre del establecimiento</label>
            <input type="text" value={estab} onChange={e => setEstab(e.target.value)}
              placeholder="Escuela las Américas" className={inputCls} />
          </div>
          <div className="bg-slate-800 rounded-xl p-3 text-xs text-slate-400 space-y-1">
            <p>El correo incluirá:</p>
            <p>· Balance docente: <span className={colorB(m.balances.docente)}>{signo(m.balances.docente)}h</span></p>
            <p>· Balance asistente: <span className={colorB(m.balances.asistente)}>{signo(m.balances.asistente)}h</span></p>
            <p>· Cursos nuevos posibles: {m.proyeccion.cursosNuevosMaximos}</p>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setEmailModal(false)}
              className="flex-1 px-4 py-2 text-sm text-slate-400 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
              Cancelar
            </button>
            <button onClick={handleSendEmail} disabled={sending}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600
                rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-colors">
              {sending ? 'Enviando…' : 'Enviar correo'}
            </button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
