import { prisma } from "@/lib/db/client"

export interface TopPage {
  path: string
  views: number
  avgDuration: number
}

export interface DeviceStat {
  device: string
  count: number
}

export interface AnalyticsOverview {
  totalViews: number
  uniqueSessions: number
  topPages: TopPage[]
  deviceDistribution: DeviceStat[]
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const totalViews = await prisma.pageView.count()

  const uniqueSessions = await prisma.pageView.groupBy({
    by: ['session_id'],
  })

  const groupedPages = await prisma.pageView.groupBy({
    by: ['path'],
    _count: {
      _all: true
    },
    _avg: {
      time_on_page_sec: true
    },
  })

  // Sort by views descending and take top 10 in JS to avoid Prisma groupBy orderBy type issues
  const topPages = groupedPages
    .sort((a, b) => b._count._all - a._count._all)
    .slice(0, 10)
    .map(p => ({
      path: p.path,
      views: p._count._all,
      avgDuration: p._avg.time_on_page_sec || 0
    }))

  const deviceDistribution = await prisma.pageView.groupBy({
    by: ['device_type'],
    _count: {
      _all: true
    }
  })

  return {
    totalViews,
    uniqueSessions: uniqueSessions.length,
    topPages,
    deviceDistribution: deviceDistribution.map(d => ({
      device: d.device_type ?? 'unknown',
      count: d._count._all
    }))
  }
}
