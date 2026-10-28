import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ClientRoot } from '@shell/client-root';

export const metadata: Metadata = {
  title: { default: 'PMSC Simulado', template: '%s · PMSC Simulado' },
  description: 'Estudo para o concurso Soldado PMSC 2026: calendário do edital, grade de estudos e simulados',
  applicationName: 'PMSC Simulado',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
  appleWebApp: { capable: true, title: 'PMSC Simulado', statusBarStyle: 'default' },
  formatDetection: { telephone: false },
  // O Next só gera "mobile-web-app-capable"; o Safari do iPhone ainda usa a versão "apple-".
  other: { 'apple-mobile-web-app-capable': 'yes' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F9FB' },
    { media: '(prefers-color-scheme: dark)', color: '#0F161C' },
  ],
};

/** Layout raiz: HTML, fonte Inter e o app (renderizado no navegador). */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
