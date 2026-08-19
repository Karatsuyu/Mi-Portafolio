# Environment Variables Security Guide

This document explains how to properly manage environment variables in the Mi-Portafolio application to maintain security and prevent credential exposure.

**Requirements covered:** 7.1-7.7 (Environment Variable Security)

---

## 🔐 Security Principles

### 1. Public vs Private Variables

Next.js distinguishes between public and private environment variables:

| Prefix | Accessibility | Use Case | Example |
|--------|---------------|----------|---------|
| `NEXT_PUBLIC_` | Browser + Server | Public configuration, API endpoints that are safe to expose | `NEXT_PUBLIC_SUPABASE_URL` |
| No prefix | Server only | Secrets, API keys, service role keys | `SUPABASE_SERVICE_ROLE_KEY` |

**⚠️ CRITICAL RULE:** Variables with `NEXT_PUBLIC_` prefix are **embedded in the client-side JavaScript bundle** and visible to anyone who inspects your website's code.

---

## ✅ Correct Usage Examples

### Public Variables (Safe to Expose)

```typescript
// ✅ CORRECT: Using public Supabase URL and anon key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**Why it's safe:**
- Supabase URL is meant to be public (it's in every API request)
- Anon key is protected by Row Level Security (RLS) policies
- Even if someone copies these, RLS prevents unauthorized data access

### Private Variables (Server-Only)

```typescript
// ✅ CORRECT: Using service role key in server-side API route
// File: app/api/admin/route.ts
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // ✅ No NEXT_PUBLIC_ prefix
  );
  
  // This bypasses RLS - use with caution
  const { data } = await supabase.from('messages').select('*');
  return Response.json({ data });
}
```

---

## ❌ Common Mistakes

### Mistake 1: Exposing Service Role Key

```bash
# ❌ WRONG: Service role key with NEXT_PUBLIC_ prefix
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...
```

**Impact:** Anyone can bypass your RLS policies and access/modify all data.

**Fix:**
```bash
# ✅ CORRECT: Service role key without prefix (server-only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...
```

### Mistake 2: Using Service Role in Client Code

```typescript
// ❌ WRONG: Service role key in client component
'use client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // ❌ This will be undefined or cause build error
);
```

**Fix:** Use service role only in server-side API routes (files in `app/api/*`).

### Mistake 3: Committing .env.local

```bash
# ❌ WRONG: .env.local in git repository
git add .env.local
git commit -m "Add environment variables"
```

**Impact:** Your secrets are now in version control history forever.

**Fix:** 
1. Ensure `.env*.local` is in `.gitignore`
2. If already committed, remove from history:
   ```bash
   git rm --cached .env.local
   git commit -m "Remove sensitive file"
   ```
3. Rotate all exposed secrets immediately

---

## 📁 File Structure

### Local Development

```
Mi-Portafolio/
├── .env.example          # ✅ Committed: Template with placeholder values
├── .env.local            # ❌ Ignored: Your actual secrets (DO NOT COMMIT)
└── .gitignore            # ✅ Contains: .env*.local
```

### .gitignore Verification

Ensure your `.gitignore` contains:

```gitignore
# local env files
.env*.local
.env
```

### Checking for Exposed Secrets

```bash
# Verify .env.local is not tracked
git status

# Search git history for potential leaks
git log --all --full-history --source -- ".env*"
```

---

## 🚀 Deployment Configuration

### Vercel

1. Go to your project: https://vercel.com/dashboard
2. Click **Settings** > **Environment Variables**
3. Add each variable:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...` | **Production only** (mark as Sensitive) |

4. **Important:** Mark `SUPABASE_SERVICE_ROLE_KEY` as **Sensitive**

### Netlify

1. Go to **Site configuration** > **Environment variables**
2. Add variables with appropriate scopes
3. Use **Sensitive variable** toggle for service role key

### Docker/Self-Hosted

```dockerfile
# docker-compose.yml
services:
  app:
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
```

Load from `.env.production` (not committed):

```bash
docker-compose --env-file .env.production up
```

---

## 🔍 Security Checklist

Before deploying to production, verify:

- [ ] `.env.example` contains only placeholder values
- [ ] `.env.local` is in `.gitignore`
- [ ] No `.env` or `.env.local` files are committed to git
- [ ] `SUPABASE_SERVICE_ROLE_KEY` does NOT have `NEXT_PUBLIC_` prefix
- [ ] Service role key is only used in `app/api/*` routes (server-side)
- [ ] All production secrets are configured in deployment platform
- [ ] Service role key is marked as "Sensitive" in deployment platform
- [ ] No hardcoded secrets in source code
- [ ] Client-side code uses anon key, not service role key

---

## 🧪 Testing Environment Variables

### Check What's Exposed to Browser

```typescript
// Add this temporarily in a client component
'use client';

export default function EnvCheck() {
  return (
    <pre>
      {JSON.stringify(
        Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')),
        null,
        2
      )}
    </pre>
  );
}
```

**Expected output:** Only variables with `NEXT_PUBLIC_` prefix should appear.

### Verify Server-Only Variables

```typescript
// app/api/test-env/route.ts
export async function GET() {
  return Response.json({
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    serviceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10),
  });
}
```

Access via `http://localhost:3000/api/test-env` - should return `hasServiceKey: true`.

**⚠️ Remove this test endpoint before deploying to production!**

---

## 🚨 What to Do If Secrets Are Exposed

### Immediate Actions

1. **Rotate all exposed credentials immediately:**
   - Go to Supabase Dashboard > Settings > API
   - Click **Reset** next to "service_role secret"
   - Update your `.env.local` and deployment platform

2. **Remove from git history:**
   ```bash
   # Use BFG Repo-Cleaner or git-filter-repo
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (WARNING: coordinate with team first)
   git push origin --force --all
   ```

3. **Check for unauthorized access:**
   - Review Supabase logs for suspicious activity
   - Check for unauthorized data modifications
   - Monitor for unusual API usage

4. **Notify your team** if working collaboratively

---

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase API Keys Best Practices](https://supabase.com/docs/guides/api/api-keys)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## 💡 Best Practices Summary

1. **Never** use `NEXT_PUBLIC_` for service role keys or secrets
2. **Always** keep `.env.local` in `.gitignore`
3. **Only** use service role keys in server-side API routes
4. **Regularly** rotate credentials (quarterly or after team changes)
5. **Use** separate credentials for development, staging, and production
6. **Enable** Supabase RLS policies to protect data even if anon key is exposed
7. **Monitor** Supabase logs for unauthorized access attempts

---

**Last Updated:** Etapa 2 - API Security Hardening
**Requirements:** 7.1-7.7
