import { notFound } from "next/navigation"

export default function TagPage({ params }: { params: { "tag-slug": string } }) {
  // In Phase 1, we'll just show a not found page
  // Full tag functionality will be implemented in a later phase
  notFound()
}