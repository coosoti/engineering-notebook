import './globals.css'
import type { Metadata } from 'next'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import CommandPalette from '@/components/CommandPalette'
import { SearchProvider } from '@/context/SearchContext'
import { Toaster } from 'sonner'
import { Inter, JetBrains_Mono } from 'next/font/google'

const interSans = Inter({
  subsets: ['latin'],
  variable: '--font-inter-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Engineering Notebook',
  description: 'Personal technical notebook for documenting AI Engineering, System Design, DevOps, MLOps, and AIOps work',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${interSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <SearchProvider>
          <AnalyticsTracker />
          <CommandPalette />
          <Toaster richColors position="top-right" />
          {children}
        </SearchProvider>
      </body>
    </html>
  )
}
