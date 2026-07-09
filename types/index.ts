export interface User {
  id: string
  name?: string | null
  email: string
  role: string
  bio?: string | null
  avatar_url?: string | null
  social_links?: any | null
  created_at: Date
  updated_at: Date
}

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  cover_image?: string | null
  body: string
  status: 'draft' | 'published' | 'archived'
  tags: string[]
  tech_stack: string[]
  github_url?: string | null
  demo_url?: string | null
  author_id: string
  author: User
  seo_title?: string | null
  seo_description?: string | null
  og_image?: string | null
  published_at?: Date | null
  updated_at: Date
  view_count: number
  created_at: Date
}

export interface Tutorial {
  id: string
  slug: string
  title: string
  summary: string
  cover_image?: string | null
  body: string
  status: 'draft' | 'published'
  tags: string[]
  author_id: string
  author: User
  series_id?: string | null
  series_order?: number | null
  seo_title?: string | null
  seo_description?: string | null
  og_image?: string | null
  published_at?: Date | null
  updated_at: Date
  view_count: number
  estimated_read_time?: number | null
  created_at: Date
}

export interface Series {
  id: string
  slug: string
  title: string
  description: string
  cover_image?: string | null
  author_id: string
  author: User
  status: 'draft' | 'published'
  created_at: Date
  updated_at: Date
}

export interface Tag {
  id: string
  slug: string
  name: string
  description?: string | null
  created_at: Date
}

export interface AuditLog {
  id: string
  user_id: string
  user: User
  action: string
  entity_type: string
  entity_id?: string | null
  metadata?: any | null
  ip_address?: string | null
  created_at: Date
}