import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',        // evita FOIT (flash of invisible text)
  preload: true,
});

export const metadata: Metadata = {
  title: 'Dashboard PIE — Gestión Escolar',
  description: 'Sistema de Gestión PIE. Decreto 170 y Ley 20.903',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
