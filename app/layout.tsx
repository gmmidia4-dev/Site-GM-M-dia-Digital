import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'GM Mídia Digital | Transformamos Tráfego em Vendas com IA',
    template: '%s | GM Mídia Digital',
  },
  description:
    'Agência de marketing digital especializada em tráfego pago, SDR com IA, automação comercial e captação de leads. Mais de 150 clientes ativos, R$50M+ gerenciados.',
  keywords: [
    'marketing digital',
    'tráfego pago',
    'meta ads',
    'google ads',
    'SDR IA',
    'automação comercial',
    'captação de leads',
    'GM Mídia Digital',
  ],
  authors: [{ name: 'GM Mídia Digital' }],
  creator: 'GM Mídia Digital',
  publisher: 'GM Mídia Digital',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gmmidia.com.br'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'GM Mídia Digital',
    title: 'GM Mídia Digital | Transformamos Tráfego em Vendas com IA',
    description:
      'Agência de marketing digital especializada em tráfego pago, SDR com IA, automação comercial e captação de leads.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GM Mídia Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GM Mídia Digital | Transformamos Tráfego em Vendas com IA',
    description:
      'Agência de marketing digital especializada em tráfego pago, SDR com IA, automação comercial e captação de leads.',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-[#0F0F0F] text-[#E2E8F0]`}>
        {children}
      </body>
    </html>
  )
}
