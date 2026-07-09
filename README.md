# Engineering Notebook & Blog Platform

This is a SEO-optimized, self-hosted-content blogging engine that serves as a personal technical notebook for documenting AI Engineering, System Design, DevOps, MLOps, and AIOps work.

## Tech Stack
- Next.js (App Router) full-stack
- TypeScript
- Postgres (Supabase or Neon)
- Auth.js (NextAuth) credentials provider
- Tiptap (rich text editor)
- Tailwind CSS

## Project Structure
```
.
├── app/                 # Next.js App Router pages and API routes
├── components/          # React components
├── lib/                 # Database access, auth, and utility functions
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── utils/               # Helper functions
├── types/               # TypeScript type definitions
├── README.md            # This file
├── package.json         # Project dependencies and scripts
└── ...
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd engineering-notebook
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your database credentials and other settings
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
npm run seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

### Admin Access
- Login at [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Default credentials:
  - Email: admin@example.com
  - Password: Admin123!

### Project Structure Details

#### Public Routes
- `/` - Homepage
- `/projects` - List of projects
- `/projects/[slug]` - Individual project page
- `/tutorials` - List of tutorials
- `/tutorials/[slug]` - Individual tutorial page

#### Admin Routes
- `/admin` - Admin dashboard
- `/admin/login` - Admin login page
- `/admin/projects` - Project management
- `/admin/tutorials` - Tutorial management

## Features Implemented in Phase 1

1. **Authentication**
   - NextAuth with credentials provider
   - Admin user protection for admin routes

2. **Database Schema**
   - Users, Projects, Tutorials, Tags, and Audit Logs
   - Prisma ORM for database operations

3. **Admin Dashboard**
   - Project CRUD operations
   - Tutorial CRUD operations
   - Dashboard with content statistics

4. **Public Site**
   - Homepage with featured content
   - Project listing and detail pages
   - Tutorial listing and detail pages

5. **SEO**
   - Basic meta tags
   - Semantic HTML structure

## Phases of Development

1. **Phase 1 - Foundation**: Auth, DB schema, admin CRUD for Projects/Tutorials, public read views, basic SEO meta, audit log
2. **Phase 2 - Series + Editor polish**: Series model, chapter ordering UI, Tiptap image upload, autosave, Shiki code highlighting
3. **Phase 3 - SEO & Discovery**: Sitemap/RSS, JSON-LD, tag pages, internal linking, OG image generation
4. **Phase 4 - Analytics**: Page view + time-on-page tracking, simple analytics dashboard
5. **Phase 5 - Deploy & later extras**: Domain setup, comments/newsletter if needed

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)# engineering-notebook
