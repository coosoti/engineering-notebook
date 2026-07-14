import { prisma } from '@/lib/db/client'
import TutorialForm from '@/components/admin/TutorialForm'

export default async function NewTutorialPage() {
  const series = await prisma.series.findMany({
    orderBy: { title: 'asc' },
    select: { id: true, title: true }
  })

  return (
    <TutorialForm
      series={series}
      mode="new"
    />
  )
}
