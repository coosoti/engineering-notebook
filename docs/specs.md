# Technical Specifications: Engineering Notebook

## 1. System Architecture

The platform is built as a full-stack Next.js 15 application using the App Router, utilizing a serverless-first architecture designed for deployment on Vercel.

### 1.1 Data Flow
- **Content Pipeline**: Admin $\to$ Tiptap Editor $\to$ Server Action $\to$ Prisma $\to$ Postgres $\to$ ISR/SSR $\to$ Reader.
- **Image Pipeline**: Client $\to$ `/api/upload` $\to$ Cloud Storage (Vercel Blob/Supabase) $\to$ DB (URL stored).
- **Search Pipeline**: Client $\to$ `/api/search` $\to$ Postgres Full-Text Search $\to$ Combined JSON Results $\to$ Command Palette.

---

## 2. API Specifications

### 2.1 Unified Search API (`/api/search`)
Provides a single endpoint to query across Projects, Tutorials, and Series.

- **Method**: `GET`
- **Parameters**: `q` (query string)
- **Logic**: 
  - Performs a `tsvector` search in Postgres.
  - Aggregates results from three different tables.
  - Returns a categorized JSON array: `{ results: [{ type: 'project' | 'tutorial' | 'series', ... }] }`.

### 2.2 Image Upload API (`/api/upload`)
Handles secure binary uploads.

- **Method**: `POST`
- **Payload**: `multipart/form-data` (`file`)
- **Logic**: 
  - Validates file type (images only).
  - Uploads to storage provider.
  - Returns a public URL.

---

## 3. Security Architecture

### 3.1 XSS Prevention
To prevent stored XSS attacks, the application implements a multi-layer sanitization strategy:
- **Sanitization**: All HTML content stored in the database is sanitized using `isomorphic-dompurify` before being rendered via `dangerouslySetInnerHTML` on the frontend.
- **Context**: Sanitization happens on the server to ensure consistency and security.

### 3.2 PII Protection
To maintain user privacy and adhere to GDPR guidelines:
- **IP Hashing**: Raw IP addresses are never stored. The `createAuditLog` service hashes the IP using `SHA-256` with a server-side salt.
- **Data Minimization**: `PageView` logs store only anonymous session IDs and truncated geographical data.

### 3.3 Authentication & Authorization
- **Auth**: Implemented via Auth.js (NextAuth) using the Credentials provider.
- **Access Control**: 
  - Client-side: Route guards via `middleware.ts` or layout checks.
  - Server-side: Server Actions verify the user's role (`admin`) before performing any mutations.

---

## 4. SEO & Performance Strategy

### 4.1 Indexing
- **Sitemap**: Dynamic `sitemap.ts` generates URLs for every published piece of content.
- **Robots**: `robots.ts` prevents indexing of the `/admin` dashboard.
- **RSS**: A dedicated `/rss.xml` route provides a standard feed for technical readers.

### 4.2 Metadata
- **Dynamic Meta**: Each page uses `generateMetadata` to produce unique titles and descriptions based on the content's `seo_title` and `seo_description`.
- **JSON-LD**: Structured data (`Article`, `CreativeWork`) is injected into the head for rich search results.

### 4.3 Rendering
- **ISR (Incremental Static Regeneration)**: Public pages are statically generated and revalidated upon publish actions, ensuring near-instant load times and fresh content.
- **Image Optimization**: utilizes `next/image` for automatic WebP conversion and responsive sizing.

---

## 5. Content Authoring Workflow

### 5.1 The Tiptap Pipeline
1. **Input**: Rich text authoring in the admin panel.
2. **Processing**:
   - `slugify()`: Automatically generates URL-friendly slugs from titles.
   - `calculateReadTime()`: Estimates reading duration based on word count.
   - `injectHeadingIds()`: Adds anchors to headings for the Table of Contents.
3. **Storage**: Content is stored as sanitized HTML in Postgres.
