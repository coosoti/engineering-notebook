export function calculateReadTime(content: string): number {
  if (!content) return 0

  // Remove HTML tags to count actual words
  const text = content.replace(/<[^>]*>/g, ' ')
  const words = text.trim().split(/\s+/).filter(word => word.length > 0)

  const wordsPerMinute = 225
  const minutes = Math.ceil(words.length / wordsPerMinute)

  return minutes
}
