export interface ProjectInput {
  title: string
  summary: string
  body: string
  cover_image?: string
  status?: string
  tags?: string[]
  tech_stack?: string[]
  github_url?: string
  demo_url?: string
  seo_title?: string
  seo_description?: string
  og_image?: string
  slug?: string
}
