'use client';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: 'bg-emerald-900/80 border-emerald-700 text-emerald-300',
    error:   'bg-red-900/80 border-red-700 text-red-300',
    info:    'bg-slate-800 border-slate-600 text-slate-200',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-xl border text-sm font-medium
        transition-all duration-300 ${colors[type]}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {message}
    </div>
  );
}
