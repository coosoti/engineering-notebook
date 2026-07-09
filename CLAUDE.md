# System Specification: Engineering Notebook & Blog Platform

## 1. Overview

A SEO-optimized, self-hosted-content blogging engine that serves as a personal technical notebook for documenting AI Engineering, System Design, DevOps, MLOps, and AIOps work. Two primary content types — **Projects** (standalone case studies) and **Tutorials** (standalone or grouped into ordered **Series**) — are authored via a rich-text WYSIWYG admin interface and published to a public-facing, SEO-optimized site. Privacy-friendly analytics track reader engagement; an audit log tracks admin/author actions.

**Stack decisions (confirmed):**
- Next.js (App Router) full-stack — React frontend + API routes/Server Actions
- Hosting: Vercel (serverless)
- Database: Managed Postgres (Supabase or Neon)
- Auth: Auth.js (NextAuth) credentials provider, email/password
- Editor: Tiptap (rich text, outputs Markdown/HTML for storage)
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
| Editor | Tiptap | ProseMirror-based; stores content as JSON + rendered HTML, exports Markdown |
| Styling | Tailwind CSS | Fast, consistent with frontend-design conventions |
| Image storage | Vercel Blob or Supabase Storage | Cover images, inline editor images |
| Analytics | Self-hosted, privacy-friendly (custom table) + optional Plausible/Umami | No third-party cookies by default |
| Hosting | Vercel | Edge caching, ISR for blog pages |
| Search | Postgres full-text search (pg_trgm/tsvector) to start; Algolia/Meilisearch later if needed | |

---

## 3. Content Model

### 3.1 Core Entities

**User (Author/Admin)**
- id, name, email, password_hash, role (`admin`, `author`, `editor` — extensible), bio, avatar_url, social_links, created_at

**Project**
- id, slug, title, summary, cover_image, body (sanitized HTML, rendered directly from Tiptap — no separate JSON storage for v1)
- status (`draft`, `published`, `archived`)
- tags[] (SEO/topic tags), tech_stack[] (e.g. "Kubernetes", "LangChain")
- github_url, demo_url, author_id
- seo_title, seo_description, og_image
- published_at, updated_at, view_count (denormalized cache)

**Tutorial (Post)**
- id, slug, title, summary, cover_image, body, status
- tags[], author_id
- series_id (nullable FK), series_order (nullable int) — null = standalone
- seo_title, seo_description, og_image
- published_at, updated_at, view_count
- estimated_read_time (auto-calculated)

**Series**
- id, slug, title, description, cover_image
- author_id, status (`draft`, `published`)
- Has many Tutorials ordered by `series_order`
- Own URL structure: `/series/[slug]` (index) and `/series/[slug]/[tutorial-slug]` (chapter)
- Tracks: total chapters, estimated total read time (derived)

**Tag**
- id, slug, name, description (optional, for tag landing pages — good for SEO)

**Comment / Reaction** *(optional, phase 2 — see open questions)*

### 3.2 Activity & Analytics Entities

**PageView**
- id, path, content_type (`project`/`tutorial`/`series`/`other`), content_id (nullable)
- session_id (anonymous, rotating, no PII), referrer, country (from IP, not stored raw), device_type
- time_on_page_seconds (captured on page exit/unload — replaces a separate ReadEvent table for v1)
- created_at

*(A separate ReadEvent table with scroll-depth tracking is deferred — see Lean v1 Scope.)*

**AuditLog** (admin actions)
- id, user_id, action (`create`, `update`, `publish`, `unpublish`, `delete`, `login`, `login_failed`)
- entity_type, entity_id, metadata (JSON diff/snapshot), ip_address, created_at

---

## 4. SEO Requirements

- Server-rendered (SSR/SSG via `generateStaticParams` + ISR) pages for all public content — no client-only rendering of post bodies
- Per-content `seo_title`, `seo_description`, canonical URL, OpenGraph + Twitter Card meta, auto-generated OG image fallback
- `sitemap.xml` (dynamic, auto-updated on publish) and `robots.txt`
- JSON-LD structured data: `Article` schema for Tutorials, `CreativeWork`/`SoftwareSourceCode` for Projects, `BreadcrumbList` for series chapters
- Clean slug-based URLs (`/projects/[slug]`, `/tutorials/[slug]`, `/series/[slug]/[chapter-slug]`)
- Tag landing pages (`/tags/[tag-slug]`) for internal linking and long-tail SEO
- RSS/Atom feed
- Automatic internal linking suggestions between series chapters (prev/next navigation = good for dwell time + crawlability)
- Image alt-text enforced as a required Tiptap image attribute
- Core Web Vitals: image optimization via `next/image`, font optimization, edge caching

---

## 5. User Roles & Permissions (designed for future multi-author)

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
- As a reader, I can browse a homepage with recent Projects and Tutorials so I can discover content.
- As a reader, I can filter/browse content by tag or topic so I can find relevant material.
- As a reader, I can view a Project page with summary, tech stack, tags, and a GitHub link.
- As a reader, I can view a Tutorial as a standalone page or navigate a Series with clear prev/next chapter links and a progress indicator (e.g. "Chapter 3 of 7").
- As a reader, I get accurate page titles/descriptions in search engine results and social shares.
- As a reader, my browsing isn't tracked with invasive cookies, but the site still works well (no cookie banner friction unless legally required).

### Epic B: Admin/Author — Content Authoring
- As an author, I can log in securely with email/password.
- As an author, I can create/edit a Project with title, summary, body (WYSIWYG), tags, tech stack, GitHub link, cover image, and SEO fields.
- As an author, I can create/edit a Tutorial, optionally assigning it to a Series with an explicit order.
- As an author, I can create a Series, set its metadata, and reorder chapters via drag-and-drop.
- As an author, I can save content as a Draft, Preview it as it will appear publicly, and Publish/Unpublish it.
- As an author, I can upload images directly within the editor (drag-drop/paste).
- As an author, I can autosave drafts so I don't lose work.

### Epic C: Admin — Management
- As an admin, I can manage user accounts and assign roles.
- As an admin, I can view an audit log of who created/edited/published/deleted what.
- As an admin, I can view site-wide analytics: top content, traffic over time, average read time/completion rate per Tutorial or Series.
- As an author, I can view analytics scoped to my own content only.

### Epic D: Platform/Non-functional
- As the system, I record anonymous page views and read-depth/time without storing PII.
- As the system, I generate sitemap.xml, robots.txt, and RSS feed automatically on publish.
- As the system, I render all public content server-side for SEO and performance.
- As the system, I enforce auth on all `/admin` routes and API mutation endpoints.

---

## 7. Key Pages / Routes

**Public**
- `/` — Home (recent content, featured)
- `/projects` , `/projects/[slug]`
- `/tutorials` , `/tutorials/[slug]`
- `/series` , `/series/[slug]` , `/series/[slug]/[chapter-slug]`
- `/tags/[tag-slug]`
- `/about`
- `/sitemap.xml`, `/rss.xml`

**Admin** (auth-gated, `/admin/*`)
- `/admin/login`
- `/admin` — dashboard (recent activity, quick analytics)
- `/admin/projects`, `/admin/projects/new`, `/admin/projects/[id]/edit`
- `/admin/tutorials`, `/admin/tutorials/new`, `/admin/tutorials/[id]/edit`
- `/admin/series`, `/admin/series/new`, `/admin/series/[id]/edit` (incl. chapter reordering)
- `/admin/users` (admin only)
- `/admin/audit-log` (admin only)
- `/admin/analytics`

---

## 8. Non-Functional Requirements

- **Performance**: Lighthouse ≥ 90 on public pages; ISR revalidation on publish actions
- **Security**: bcrypt/argon2 password hashing, rate-limited login, CSRF protection on forms, input sanitization on rendered HTML (prevent stored XSS from editor output)
- **Privacy**: No raw IP storage (hash or truncate); no third-party tracking cookies by default; clear privacy policy page
- **Scalability**: Stateless API routes (serverless-safe), connection pooling for Postgres
- **Backups**: Automated DB backups (managed Postgres provider feature)
- **Accessibility**: Semantic HTML from Tiptap output, alt text enforced, keyboard-navigable admin UI

---

## 9. Lean v1 Scope (Decisions Finalized)

To keep this fast to build and maintain, v1 deliberately excludes features that add complexity without near-term payoff. All are still possible later because the schema (roles, audit log) is designed to support them.

**Confirmed for v1:**
- Code syntax highlighting: **Shiki**, integrated into Tiptap's code block extension
- No revision history — **publish/unpublish + audit log only** (audit log already gives a "what changed and when" trail without storing full content snapshots per edit)
- Domain/hosting accounts not yet set up — **deployment is a later step**, build runs locally / on a preview URL first
- Single admin user — role table exists in schema but permission UI is skipped; access checks are a simple `role === 'admin'` guard in code, not a full RBAC system

**Cut from v1 entirely (re-added only if you actually need them later):**
- Reader comments / reactions
- Newsletter / email capture
- Multi-author management UI (schema supports it; UI doesn't exist yet)
- Detailed scroll-depth / behavior analytics — v1 logs page views + time-on-page only
- Third-party search (Algolia/Meilisearch) — Postgres full-text search is sufficient at this scale
- Tiptap JSON storage — store rendered, sanitized HTML directly; simpler to render, still fine for SEO

---

## 10. Suggested Build Phases

1. **Phase 1 — Foundation**: Auth (single admin), DB schema, admin CRUD for Projects/Tutorials (no series yet), public read views, basic SEO meta, audit log
2. **Phase 2 — Series + Editor polish**: Series model, chapter ordering UI, Tiptap image upload, autosave, Shiki code highlighting
3. **Phase 3 — SEO & Discovery**: Sitemap/RSS, JSON-LD, tag pages, internal linking, OG image generation
4. **Phase 4 — Analytics**: Page view + time-on-page tracking, simple analytics dashboard
5. **Phase 5 — Deploy & later extras**: Domain + Vercel/Supabase setup, then comments/newsletter/multi-author UI if ever needed
