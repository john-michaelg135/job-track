# Job Application Tracker — Product Requirements Document

## Overview
A full-stack web app where job seekers track their applications in one place. Each user signs up, logs in, and manages their own private list of job applications with status tracking.

## Target User
Individual job seekers who want a simple, clean way to track where they've applied, what stage they're in, and any notes.

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Supabase (auth, database, RLS)
- Tailwind CSS 4
- Deployed on Vercel

## Features (MVP)

### Authentication
- Email/password sign-up and login
- Logout
S- Session-aware navigation (show user email, redirect unauthenticated users)

### Dashboard
- List all job applications for the signed-in user
- Show: company name, role title, status, date applied
- Filter by status (Applied, Interviewing, Offer, Rejected)
- Empty state for new users

### Add / Edit Application
- Form: company name, role title, URL (optional), status, date applied, notes
- Inline edit or modal
- Delete an application

### Data Model
**Table: `applications`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | default gen_random_uuid() |
| user_id | uuid (FK → auth.users) | not null |
| company | text | not null |
| role | text | not null |
| url | text | nullable |
| status | text | default 'applied', check in ('applied','interviewing','offer','rejected') |
| applied_date | date | default current_date |
| notes | text | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### Row-Level Security
- RLS enabled on `applications`
- Policy: users can SELECT, INSERT, UPDATE, DELETE only rows where `user_id = auth.uid()`

## UI/UX
- Mobile-first, responsive
- Clean, modern design with clear visual hierarchy
- Status badges with color coding
- Accessible form inputs with labels

## Non-Goals (out of scope for MVP)
- OAuth/social login
- Reminders or notifications
- Analytics/charts
- Resume upload
- Sharing or collaboration
