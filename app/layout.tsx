import './globals.css'
import type { Metadata } from 'next'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import CommandPalette from '@/components/CommandPalette'
import { SearchProvider } from '@/context/SearchContext'
import { Toaster } from 'sonner'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
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
