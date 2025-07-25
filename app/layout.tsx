import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider, UserProvider } from "@/components/theme-provider"
import { SessionProvider } from 'next-auth/react'
import ClientProviders from '@/components/ClientProviders'
import ClientLayout from './ClientLayout'

export const metadata: Metadata = {
  title: 'INFINITO',
  description: 'Economia circular têxtil',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body className="font-raleway min-h-screen">
        <ClientProviders>
          <ClientLayout>{children}</ClientLayout>
        </ClientProviders>
      </body>
    </html>
  )
}
