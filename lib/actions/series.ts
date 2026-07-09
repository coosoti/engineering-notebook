"use server"

import { prisma } from "@/lib/db/client"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createSeries(data: {
  title: string;
  slug: string;
  description?: string;
  cover_image?: string
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'You must be logged in to create a series' }
    }

    // Check if slug already exists
    const existing = await prisma.series.findUnique({
      where: { slug: data.slug }
    })

    if (existing) {
      return {
        success: false,
        error: "A series with this slug already exists"
      }
    }

    const series = await prisma.series.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        cover_image: data.cover_image || null,
        author_id: session.user.id,
        status: 'draft',
      },
    })

    revalidatePath('/admin/series')
    return { success: true, data: series }
  } catch (error: any) {
    console.error('Error creating series:', error)
    return {
      success: false,
      error: error.message || 'Failed to create series'
    }
  }
}

export async function updateSeries(id: string, data: {
  title?: string;
  slug?: string;
  description?: string;
  cover_image?: string;
  status?: string
}) {
  try {
    // Check if series exists
    const existing = await prisma.series.findUnique({
      where: { id }
    })

    if (!existing) {
      return {
        success: false,
        error: "Series not found"
      }
    }

    // If slug is being updated, check uniqueness
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.series.findUnique({
        where: { slug: data.slug }
      })

      if (slugExists) {
        return {
          success: false,
          error: "A series with this slug already exists"
        }
      }
    }

    const series = await prisma.series.update({
      where: { id },
      data,
    })

    revalidatePath('/admin/series')
    revalidatePath(`/series/${series.slug}`)

    return { success: true, data: series }
  } catch (error: any) {
    console.error('Error updating series:', error)
    return {
      success: false,
      error: error.message || 'Failed to update series'
    }
  }
}

export async function deleteSeries(id: string) {
  try {
    // Check if series exists
    const existing = await prisma.series.findUnique({
      where: { id },
      include: { tutorials: true }
    })

    if (!existing) {
      return {
        success: false,
        error: "Series not found"
      }
    }

    // Check if series has tutorials
    if (existing.tutorials.length > 0) {
      return {
        success: false,
        error: `Cannot delete series with ${existing.tutorials.length} associated tutorials. Remove or reassign them first.`
      }
    }

    await prisma.series.delete({
      where: { id },
    })

    revalidatePath('/admin/series')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting series:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete series'
    }
  }
}

export async function reorderTutorialsAction(seriesId: string, tutorialIds: string[]) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== 'admin') {
      throw new Error("Unauthorized")
    }

    // Perform multiple updates in a transaction
    await prisma.$transaction(
      tutorialIds.map((id, index) =>
        prisma.tutorial.update({
          where: { id },
          data: { series_order: index }
        })
      )
    )

    revalidatePath('/admin/series')
    // We can't easily revalidate a dynamic slug route without knowing the slug,
    // but revalidating the admin series page is a start.

    return { success: true }
  } catch (error: any) {
    console.error('Error reordering tutorials:', error)
    return {
      success: false,
      error: error.message || 'Failed to reorder tutorials'
    }
  }
}
