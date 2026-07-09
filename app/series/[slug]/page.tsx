import { notFound } from "next/navigation"

export default function SeriesDetailPage({ params }: { params: { slug: string } }) {
  // In Phase 1, we'll just show a not found page
  // Full series functionality will be implemented in Phase 2
  notFound()
}