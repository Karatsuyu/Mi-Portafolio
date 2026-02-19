# Backend (Supabase + Next.js API Routes)

The backend for this project combines:
- Supabase (Postgres DB, Auth, Storage, Realtime)
- Next.js API Routes (serverless endpoints) under `frontend/app/api/*`

This approach keeps the infra light while providing authentication, database, and file storage without maintaining a separate server.

## Why this architecture
- Minimal ops overhead
- First-class integration with Next.js
- Secure database via Supabase policies (RLS)
- Scale-ready with serverless endpoints

## Services
- Auth: Supabase Auth
- Database: Supabase Postgres
- Storage: Supabase Buckets (for images/files)
- API: Next.js API Routes

## Data model (SQL)
Run these in Supabase SQL editor:

```sql
-- Messages from contact form
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  technologies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level BETWEEN 0 AND 100),
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS)
Enable RLS and add policies to allow appropriate reads/writes, e.g.:

```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert_messages_public" ON messages
  FOR INSERT TO anon
  WITH CHECK (true);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_projects_public" ON projects
  FOR SELECT TO anon
  USING (true);
CREATE POLICY "insert_projects_authenticated" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (true);
```

Adjust policies to your needs (public read vs. authenticated writes).

## API Endpoints
- `POST /api/contact` → inserts into `messages`
- `GET /api/contact` → fetches `messages`
- `GET /api/projects` → lists projects
- `POST /api/projects` → creates a project (consider requiring auth)

## Environment
Set these in `frontend/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
For server-side keys (service role) use server-only envs (do NOT expose in the client):
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # use only on secure server side
```

## Future extensions
- Auth flows (login/register) via Supabase Auth
- Private admin dashboard for managing projects
- Storage bucket for project images and resume files
- Webhooks for notifications (Supabase functions or Edge Functions)
