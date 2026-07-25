# JobTrack

A full-stack job application tracker built with Next.js, Supabase, and Tailwind CSS. Track your applications, update statuses, and stay organized — all in one private, secure place.

**Live:** [kiro-app-bice.vercel.app](https://kiro-app-bice.vercel.app)

## Features

- **Email/password authentication** with email confirmation
- **Private by default** — Row-Level Security ensures users only see their own data
- **CRUD operations** — Add, edit, delete, and filter job applications
- **Status tracking** — Applied, Interviewing, Offer, Rejected with color-coded badges
- **Dark/light mode** — System preference detection + manual toggle
- **5 accent themes** — Indigo, Teal, Rose, Amber, Emerald
- **Material You design** — Fluid animations, spring physics, morphing cursor effect
- **Mobile-first** — Responsive layout with touch-optimized interactions
- **Legal compliance** — Privacy Policy, Terms of Service, cookie consent banner

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (email/password) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Animation | Motion (framer-motion) |
| Icons | Phosphor Icons |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project ([supabase.com](https://supabase.com))

### Setup

```bash
# Clone the repo
git clone https://github.com/john-michaelg135/job-track.git
cd job-track

# Install dependencies
npm install

# Create env file
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# Run the dev server
npm run dev
```

### Database Setup

Create the `applications` table in your Supabase project:

```sql
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company text NOT NULL,
  role text NOT NULL,
  url text,
  status text NOT NULL DEFAULT 'applied' 
    CHECK (status IN ('applied', 'interviewing', 'offer', 'rejected')),
  applied_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications" ON public.applications
  FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert own applications" ON public.applications
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update own applications" ON public.applications
  FOR UPDATE USING ((select auth.uid()) = user_id) 
  WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete own applications" ON public.applications
  FOR DELETE USING ((select auth.uid()) = user_id);
```

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

## Project Structure

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/                # Login page
│   ├── signup/               # Signup page
│   ├── dashboard/            # Protected dashboard (CRUD)
│   ├── auth/                 # Auth routes (confirm, callback, confirmed)
│   ├── privacy/              # Privacy Policy
│   └── terms/                # Terms of Service
├── components/
│   ├── application-list.tsx  # Main dashboard list with filters
│   ├── application-form.tsx  # Add/edit modal
│   ├── dashboard-nav.tsx     # Nav with theme/accent controls
│   ├── background-effects.tsx # Animated orbs + cursor glow
│   ├── consent-banner.tsx    # Cookie/privacy consent
│   └── status-badge.tsx      # Color-coded status pills
├── lib/
│   ├── supabase/             # Server + client Supabase helpers
│   ├── theme.tsx             # Theme context provider
│   └── types.ts              # TypeScript interfaces
└── proxy.ts                  # Auth middleware (Next.js 16 proxy convention)
```

## Security

- Passwords hashed with bcrypt (Supabase handles this)
- All data encrypted in transit (TLS) and at rest (AES-256)
- Row-Level Security on all tables
- HTTP-only auth cookies
- No tracking or advertising cookies
- GDPR/CCPA compliant data handling

## License

MIT
