'use client';
import { usePieData }         from '@/hooks/usePieData';
import { calcularMetricasPIE } from '@/utils/motorCalculo';
import {
  Users, BookOpen, TrendingUp, TrendingDown,
  GraduationCap, AlertTriangle, CheckCircle, Zap,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

function StatCard({ title, value, sub, icon: Icon, positive, neutral }: {
  title: string; value: string | number; sub?: string;
  icon: React.ElementType; positive?: boolean; neutral?: boolean;
}) {
  const color = neutral
    ? 'bg-indigo-500/20 text-indigo-400'
    : positive
    ? 'bg-emerald-500/20 text-emerald-400'
    : 'bg-red-500/20 text-red-400';
  const valColor = neutral ? 'text-white' : positive ? 'text-emerald-400' : 'text-red-400';
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-400 text-sm">{title}</p>
        <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
          <Icon size={18} />
        </div>
      </div>
      <p className={`text-3xl font-bold ${valColor}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

const COLORS = ['#818cf8', '#22d3ee', '#f59e0b'];

export default function DashboardPage() {
  const { cursos, profesionales, loading, error } = usePieData();

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="bg-red-900/30 border border-red-800 rounded-2xl p-6 text-center max-w-md">
        <p className="text-red-400 font-medium mb-2">Error de conexión a Supabase</p>
        <p className="text-slate-400 text-sm">{error}</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
    </div>
  );

  const m = calcularMetricasPIE(cursos, profesionales);
  const { requeridas, disponibles, balances, proyeccion, alertasCursos, alertasGlobales } = m;

  const signo = (n: number) => n >= 0 ? `+${n.toFixed(1)}` : n.toFixed(1);

  const barData = [
    { name: 'Docente',      Requeridas: parseFloat(requeridas.docente.toFixed(1)),      Disponibles: disponibles.docente },
    { name: 'Asistente',    Requeridas: parseFloat(requeridas.asistente.toFixed(1)),    Disponibles: disponibles.asistente },
    { name: 'Coordinación', Requeridas: parseFloat(requeridas.coordinacion.toFixed(1)), Disponibles: disponibles.coordinacion },
  ];

  const pieData = [
    { name: 'NEEP', value: m.totalNEEP },
    { name: 'NEET', value: m.totalNEET },
  ];

  const alertasCriticas = alertasGlobales.filter(a => a.tipo === 'critica');

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="text-indigo-400" size={26} />
          Dashboard PIE
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Estado normativo — Decreto 170 · Ley 20.903
        </p>
      </div>

      {/* Alertas críticas */}
      {alertasCriticas.length > 0 && (
        <div className="space-y-2">
          {alertasCriticas.map((a, i) => (
            <div key={i} className="flex items-center gap-3 bg-red-900/30 border border-red-800 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm font-medium">{a.mensaje}</p>
            </div>
          ))}
        </div>
      )}

      {/* Alertas por curso */}
      {alertasCursos.length > 0 && (
        <div className="space-y-2">
          {alertasCursos.map((a, i) => (
            <div key={i} className="flex items-center gap-3 bg-amber-900/20 border border-amber-800/50 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
              <p className="text-amber-300 text-sm">
                <span className="font-medium">{a.nombre}:</span> {a.mensaje}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Estudiantes" value={m.totalEstudiantes}
          sub={`${m.totalNEEP} NEEP · ${m.totalNEET} NEET`}
          icon={Users} neutral
        />
        <StatCard
          title="Total Cursos" value={cursos.length}
          sub={`${cursos.filter(c=>c.tieneJEC).length} JEC · ${cursos.filter(c=>!c.tieneJEC).length} sin JEC`}
          icon={BookOpen} neutral
        />
        <StatCard
          title="Balance Docente"
          value={`${signo(balances.docente)}h`}
          sub={`${disponibles.docente}h disp. / ${requeridas.docente.toFixed(1)}h req.`}
          icon={balances.docente >= 0 ? TrendingUp : TrendingDown}
          positive={balances.docente >= 0}
        />
        <StatCard
          title="Balance Asistente"
          value={`${signo(balances.asistente)}h`}
          sub={`${disponibles.asistente}h disp. / ${requeridas.asistente.toFixed(1)}h req.`}
          icon={balances.asistente >= 0 ? TrendingUp : TrendingDown}
          positive={balances.asistente >= 0}
        />
      </div>

      {/* Proyección + Coordinación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-indigo-400" />
            <p className="text-white font-semibold text-sm">Proyección de Crecimiento</p>
          </div>
          <p className="text-4xl font-bold text-indigo-400">{proyeccion.cursosNuevosMaximos}</p>
          <p className="text-slate-400 text-xs mt-1">cursos nuevos posibles (JEC · 5 NEET · 2 NEEP)</p>
          <div className="mt-3 space-y-1 text-xs text-slate-500">
            <p>Por horas docentes: {proyeccion.cursosPosiblesPorDocente} cursos</p>
            <p>Por coordinación: {proyeccion.cursosPosiblesPorCoord} cursos</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            {balances.coordinacion >= 0
              ? <CheckCircle size={16} className="text-emerald-400" />
              : <AlertTriangle size={16} className="text-red-400" />}
            <p className="text-white font-semibold text-sm">Coordinación PIE</p>
          </div>
          <p className={`text-4xl font-bold ${balances.coordinacion >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {signo(balances.coordinacion)}h
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {disponibles.coordinacion}h disp. / {requeridas.coordinacion.toFixed(1)}h req.
          </p>
          <p className="text-slate-500 text-xs mt-2">
            {cursos.length} cursos × 2h = {requeridas.coordinacion}h requeridas
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4 text-sm">Balance de Horas por Tipo</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }} itemStyle={{ color: '#94a3b8' }}
              />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 11 }} />
              <Bar dataKey="Requeridas"  fill="#818cf8" radius={[4,4,0,0]} />
              <Bar dataKey="Disponibles" fill="#22d3ee" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4 text-sm">Distribución de Estudiantes</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
