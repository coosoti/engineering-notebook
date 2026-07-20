# System Specification: Engineering Notebook & Blog Platform

## 1. Overview

A SEO-optimized, self-hosted-content blogging engine that serves as a personal technical notebook for documenting AI Engineering, System Design, DevOps, MLOps, and AIOps work. The platform adopts an "Architect" brand identity—minimal, precise, and professional.

Two primary content types — **Projects** (standalone case studies) and **Tutorials** (standalone or grouped into ordered **Series**) — are authored via a high-performance WYSIWYG admin interface and published to a public-facing, SEO-optimized site. Privacy-friendly analytics track reader engagement; an audit log tracks admin/author actions.

**Stack decisions (confirmed):**
- Next.js (App Router) full-stack — React frontend + API routes/Server Actions
- Hosting: Vercel (serverless)
- Database: Managed Postgres (Supabase or Neon)
- Auth: Auth.js (NextAuth) credentials provider, email/password
- Editor: Tiptap (rich text, outputs sanitized HTML for storage)
- Roles: Single admin now, multi-author/role support designed in from the start

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15+ (App Router) | SSR/SSG for SEO; Server Actions for mutations |
| Language | TypeScript | End-to-end type safety |
| DB | Postgres (Supabase or Neon) | Serverless-friendly connection pooling (Prisma Accelerate or PgBouncer) |
| ORM | Prisma | Schema-first, migrations |
| Auth | Auth.js (NextAuth) v5 | Credentials provider; JWT or DB sessions |
| Editor | Tiptap | ProseMirror-based; stores content as sanitized HTML |
| Styling | Tailwind CSS | Fast, consistent with "Architect" design conventions |
| Motion | Framer Motion | Smooth page transitions and micro-interactions |
| Notifications | Sonner | Premium, non-blocking toast notifications |
| Security | isomorphic-dompurify | Server-side HTML sanitization to prevent XSS |
| Image storage | Vercel Blob or Supabase Storage | Cover images, inline editor images |
| Analytics | Self-hosted, privacy-friendly (custom table) | No third-party cookies by default |
| Hosting | Vercel | Edge caching, ISR for blog pages |
| Search | Postgres full-text search (pg_trgm/tsvector) | Unified search across all content types |

---

## 3. Content Model

### 3.1 Core Entities

**User (Author/Admin)**
- id, name, email, password_hash, role (`admin`, `author`, `editor`), bio, avatar_url, social_links, created_at

**Project**
- id, slug, title, summary, cover_image, body (sanitized HTML)
- status (`draft`, `published`, `archived`)
- tags[] (SEO/topic tags), tech_stack[] (e.g. "Kubernetes", "LangChain")
- github_url, demo_url, author_id
- seo_title, seo_description, og_image
- published_at, updated_at, view_count (denormalized cache)

**Tutorial (Post)**
- id, slug, title, summary, cover_image, body, status
- tags[], author_id
- series_id (nullable FK), series_order (nullable int)
- seo_title, seo_description, og_image
- published_at, updated_at, view_count
- estimated_read_time (auto-calculated)

**Series**
- id, slug, title, description, cover_image
- author_id, status (`draft`, `published`)
- Has many Tutorials ordered by `series_order`
- Own URL structure: `/series/[slug]` and `/series/[slug]/[tutorial-slug]`

**Tag**
- id, slug, name, description (optional)

### 3.2 Activity & Analytics Entities

**PageView**
- id, path, content_type, content_id (nullable)
- session_id (anonymous, rotating), referrer, country, device_type
- time_on_page_seconds, created_at

**AuditLog** (admin actions)
- id, user_id, action, entity_type, entity_id, metadata (JSON), ip_address (hashed), created_at

---

## 4. SEO Requirements

- Server-rendered (SSR/SSG via `generateStaticParams` + ISR) pages for all public content.
- Per-content `seo_title`, `seo_description`, canonical URL, OpenGraph + Twitter Card meta.
- `sitemap.xml` (dynamic, auto-updated) and `robots.txt`.
- JSON-LD structured data: `Article` (Tutorials), `CreativeWork` (Projects), `BreadcrumbList` (Series).
- Clean slug-based URLs.
- Tag landing pages for internal linking and long-tail SEO.
- RSS/Atom feed.
- Automatic internal linking suggestions (prev/next) for series.
- Image alt-text enforced in editor.
- Core Web Vitals: image optimization via `next/image`, font optimization, edge caching.

---

## 5. User Roles & Permissions

| Capability | Admin | Author | Editor (future) | Public |
|---|---|---|---|---|
| Write/edit own drafts | ✅ | ✅ | ✅ | ❌ |
| Edit others' content | ✅ | ❌ | ✅ | ❌ |
| Publish/unpublish | ✅ | ✅ (own) | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ | ❌ |
| View analytics (own content) | ✅ | ✅ | ✅ | ❌ |
| View site-wide analytics | ✅ | ❌ | ❌ | ❌ |
| View audit log | ✅ | ❌ | ❌ | ❌ |
| Read published content | ✅ | ✅ | ✅ | ✅ |

---

## 6. Epics & User Stories

### Epic A: Public Site (Readers)
- As a reader, I can discover content via a "Curated Gallery" home page with featured spotlights.
- As a reader, I can navigate the site instantly using a global Command Palette (Cmd+K).
- As a reader, I can track my reading progress via a top-mounted progress bar.
- As a reader, I can easily copy code snippets via integrated "Copy" buttons in code blocks.
- As a reader, I get a seamless experience with fluid page transitions.

### Epic B: Admin/Author — Content Authoring
- As an author, I can use a professional WYSIWYG editor with:
  - Automated slug generation from titles.
  - Image upload modal (File & URL) and paste-to-upload support.
  - Block-type selection dropdown (Paragraph, H1-H3, Code Block).
  - Inline code and blockquote formatting.
  - Autosave functionality.
- As an author, I can manage Projects, Tutorials, and Series with full CRUD and SEO controls.

### Epic C: Admin — Management
- As an admin, I can manage user accounts and roles.
- As an admin, I can monitor system activity via a privacy-preserving Audit Log (hashed IPs).
- As an admin, I can view site-wide analytics and content performance.

### Epic D: Platform/Non-functional
- As the system, I sanitize all rendered HTML to prevent XSS attacks using `isomorphic-dompurify`.
- As the system, I protect PII by hashing IP addresses in audit logs.
- As the system, I generate sitemap.xml, robots.txt, and RSS feeds automatically.
- As the system, I enforce auth on all `/admin` routes and API mutation endpoints.

---

## 7. Key Pages / Routes

**Public**
- `/` — Home (Featured content, Latest Insights)
- `/projects` , `/projects/[slug]`
- `/tutorials` , `/tutorials/[slug]`
- `/series` , `/series/[slug]` , `/series/[slug]/[chapter-slug]`
- `/tags/[tag-slug]`
- `/about`
- `/sitemap.xml`, `/rss.xml`

**Admin** (auth-gated, `/admin/*`)
- `/admin/login`
- `/admin` — dashboard
- `/admin/projects`, `/admin/projects/new`, `/admin/projects/[id]/edit`
- `/admin/tutorials`, `/admin/tutorials/new`, `/admin/tutorials/[id]/edit`
- `/admin/series`, `/admin/series/new`, `/admin/series/[id]/edit`
- `/admin/users` (admin only)
- `/admin/audit-log` (admin only)
- `/admin/analytics`

---

## 8. Non-Functional Requirements

- **Performance**: Lighthouse ≥ 90; ISR revalidation on publish.
- **Security**: bcrypt/argon2 hashing, rate-limited login, CSRF protection, strict HTML sanitization.
- **Privacy**: No raw IP storage; no third-party tracking cookies; clear privacy policy.
- **Scalability**: Stateless API routes, connection pooling for Postgres.
- **Accessibility**: Semantic HTML, alt text enforced, keyboard-navigable UI.

---

## 9. Lean v1 Scope (Finalized)

**Confirmed for v1:**
- Unified Search via Command Palette.
- Professional Tiptap Editor with image uploads and auto-slugs.
- Curated Gallery layout with tech stack and read-time metadata.
- Full SEO suite (Sitemap, Robots, RSS, JSON-LD).
- Privacy-preserving Audit Logs.
- Fluid UX (Framer Motion, Sonner Toasts, Reading Progress Bar).

**Cut from v1:**
- Reader comments / reactions.
- Newsletter / email capture.
- Multi-author management UI.
- Detailed scroll-depth analytics.
- Third-party search providers.

---

## 10. Suggested Build Phases (Completed)

1. **Phase 1 — Foundation**: Auth, DB schema, basic admin CRUD, public read views, basic SEO.
2. **Phase 2 — Series & Editor**: Series model, chapter ordering, image upload, autosave, Shiki highlighting.
3. **Phase 3 — SEO & Discovery**: Sitemap/RSS, JSON-LD, tag pages, internal linking.
4. **Phase 4 — Analytics & Security**: Page view tracking, XSS sanitization, IP hashing.
5. **Phase 5 — Premium UX**: Command Palette, Curated Gallery, Page Transitions, Reading Progress Bar.
