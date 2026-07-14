import { prisma } from '@/lib/db/client'
import TutorialForm from '@/components/admin/TutorialForm'

export default async function EditTutorialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tutorial = await prisma.tutorial.findUnique({
    where: { id },
  })

  if (!tutorial) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Tutorial not found.</p>
      </div>
    )
  }

  const series = await prisma.series.findMany({
    orderBy: { title: 'asc' },
    select: { id: true, title: true }
  })

  return (
    <TutorialForm
      initialData={tutorial}
      series={series}
      mode="edit"
    />
  )
}
