import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
import './globals.css'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IoT | Monitoreo Ambiental',
  description: 'Dashboard de monitoreo IoT para sensores ambientales en tiempo real. Visualiza datos de temperatura, humedad, iluminación y ubicación de estaciones de sensores.',
  keywords: 'IoT, dashboard, sensores, monitoreo ambiental, temperatura, humedad, tiempo real',
  authors: [{ name: 'IoT Dashboard Team' }],
  openGraph: {
    title: 'IoT Dashboard | Monitoreo Ambiental',
    description: 'Dashboard de monitoreo IoT para sensores ambientales en tiempo real',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
