'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Users, FileSpreadsheet, GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/',               label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/cursos',         label: 'Cursos',          icon: BookOpen },
  { href: '/profesionales',  label: 'Profesionales',   icon: Users },
  { href: '/reportes',       label: 'Reportes',        icon: FileSpreadsheet },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Dashboard PIE</p>
            <p className="text-slate-500 text-xs">Gestión Escolar</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <p className="text-[10px] text-slate-600 text-center leading-relaxed">
          Decreto 170 · Ley 20.903<br />
          Programa de Integración Escolar
        </p>
      </div>
    </aside>
  );
}
