import './globals.css'
import type { Metadata } from 'next'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'

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
      <body>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  )
}
