# Supabase Configuration & Security

This directory contains SQL migrations and documentation for configuring Supabase Row Level Security (RLS) policies for the Mi-Portafolio application.

## 📋 Requirements Coverage

This implementation covers **Requirements 6.1-6.9** from the Etapa 2 specification:
- ✅ Enable RLS on messages, projects, and visits tables
- ✅ Define policies for anonymous INSERT operations
- ✅ Define policies for admin-only SELECT/UPDATE/DELETE operations
- ✅ Restrict service role key usage to server-side only

---

## 🚀 Quick Start: Applying RLS Policies

### Option 1: Supabase SQL Editor (Recommended)

1. Open your Supabase Dashboard: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `migrations/20240101000000_enable_rls_security.sql`
5. Paste into the SQL Editor
6. Click **Run** to execute the migration
7. Verify success in the **Table Editor** > Select a table > **RLS Policies** tab

### Option 2: Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your project ref)
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

### Option 3: Manual via psql

If you have direct database access:

```bash
psql -h db.your-project-ref.supabase.co -U postgres -d postgres -f migrations/20240101000000_enable_rls_security.sql
```

---

## 🔐 Post-Migration Configuration

### 1. Configure Admin User

After applying the migration, you need to designate admin users:

**Via Supabase Dashboard:**
1. Go to **Authentication** > **Users**
2. Click on your admin user
3. Scroll to **Raw User Meta Data**
4. Add the following JSON:
   ```json
   {
     "role": "admin"
   }
   ```
5. Click **Save**

**Via SQL:**
```sql
-- Replace 'admin@example.com' with your admin email
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'admin@example.com';
```

### 2. Remove Development Policies (Production Only)

The migration includes development-friendly policies with `auth.uid() IS NOT NULL` that allow all authenticated users to perform admin operations. **You must remove these before going to production.**

Find and remove these lines from each policy:

```sql
-- REMOVE THIS IN PRODUCTION:
OR auth.uid() IS NOT NULL
```

Replace with proper admin role checks:

```sql
-- KEEP THIS FOR PRODUCTION:
EXISTS (
  SELECT 1 FROM auth.users
  WHERE auth.users.id = auth.uid()
  AND auth.users.raw_user_meta_data->>'role' = 'admin'
)
```

---

## 🛡️ Security Best Practices

### Service Role Key Security (Requirements 6.8, 6.9)

**✅ CORRECT Usage:**
```typescript
// ✅ Server-side API route (app/api/admin/messages/route.ts)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // ✅ NOT prefixed with NEXT_PUBLIC_
);
```

**❌ INCORRECT Usage:**
```typescript
// ❌ NEVER do this - exposes service role key to client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!  // ❌ BAD!
);
```

### Environment Variables Checklist

**`.env.local` (never commit):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...  # ✅ Public - safe to expose
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...      # ❌ Private - server-only
```

**`.gitignore` (verify these are included):**
```
.env
.env.local
.env*.local
```

---

## 🧪 Testing RLS Policies

### Test 1: Anonymous User (Contact Form)

```typescript
// Should succeed - anonymous INSERT allowed
const { data, error } = await supabaseAnon
  .from('messages')
  .insert({ name: 'Test', email: 'test@example.com', message: 'Hello' });

console.log(error); // null
```

```typescript
// Should fail - anonymous SELECT not allowed
const { data, error } = await supabaseAnon
  .from('messages')
  .select('*');

console.log(error); // Row Level Security policy violation
```

### Test 2: Authenticated Non-Admin User

```typescript
// Should succeed - authenticated INSERT allowed
const { data, error } = await supabaseAuth
  .from('messages')
  .insert({ name: 'User', email: 'user@example.com', message: 'Hi' });

console.log(error); // null
```

```typescript
// Should fail - non-admin SELECT not allowed
const { data, error } = await supabaseAuth
  .from('messages')
  .select('*');

console.log(error); // Row Level Security policy violation
```

### Test 3: Authenticated Admin User

```typescript
// Should succeed - admin SELECT allowed
const { data, error } = await supabaseAdmin
  .from('messages')
  .select('*');

console.log(data); // Array of messages
console.log(error); // null
```

### Test 4: Public Projects

```typescript
// Should succeed - public SELECT allowed for everyone
const { data, error } = await supabaseAnon
  .from('projects')
  .select('*');

console.log(data); // Array of projects
```

```typescript
// Should fail - anonymous INSERT not allowed
const { data, error } = await supabaseAnon
  .from('projects')
  .insert({ title: 'Hack', description: 'Malicious' });

console.log(error); // Row Level Security policy violation
```

---

## 📊 RLS Policy Summary

| Table    | Operation | Anonymous | Authenticated | Admin |
|----------|-----------|-----------|---------------|-------|
| messages | INSERT    | ✅        | ✅            | ✅    |
| messages | SELECT    | ❌        | ❌            | ✅    |
| messages | UPDATE    | ❌        | ❌            | ✅    |
| messages | DELETE    | ❌        | ❌            | ✅    |
| projects | SELECT    | ✅        | ✅            | ✅    |
| projects | INSERT    | ❌        | ❌            | ✅    |
| projects | UPDATE    | ❌        | ❌            | ✅    |
| projects | DELETE    | ❌        | ❌            | ✅    |
| visits   | INSERT    | ✅        | ✅            | ✅    |
| visits   | SELECT    | ✅        | ✅            | ✅    |
| visits   | UPDATE    | ❌        | ❌            | ✅    |
| visits   | DELETE    | ❌        | ❌            | ✅    |

---

## 🔍 Monitoring & Debugging

### Check Active RLS Policies

```sql
-- View all RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public';
```

### Test Policy as Anonymous User

```sql
-- Switch to anon role
SET ROLE anon;

-- Try to access messages (should fail)
SELECT * FROM messages;

-- Reset role
RESET ROLE;
```

### Enable Supabase Logging

1. Go to **Settings** > **Logs** in Supabase Dashboard
2. Enable **Database Logs**
3. Monitor for RLS policy violations:
   ```
   ERROR: new row violates row-level security policy for table "messages"
   ```

---

## 🚨 Troubleshooting

### Issue: "Permission denied for table messages"

**Cause:** RLS is enabled but no policies exist or policies are too restrictive.

**Solution:**
1. Verify policies are created: `SELECT * FROM pg_policies WHERE tablename = 'messages';`
2. Check policy conditions match your use case
3. Ensure you're using the correct Supabase client (anon vs service role)

### Issue: "Anonymous users can see all messages"

**Cause:** RLS is not enabled on the table.

**Solution:**
```sql
-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Verify
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'messages';
-- rowsecurity should be 't' (true)
```

### Issue: "Admin user can't access messages"

**Cause:** Admin role not set in user metadata.

**Solution:**
1. Check user metadata:
   ```sql
   SELECT email, raw_user_meta_data FROM auth.users WHERE email = 'admin@example.com';
   ```
2. Verify `raw_user_meta_data` contains `{"role": "admin"}`
3. If not, update as shown in "Configure Admin User" section

---

## 📚 Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

---

## ✅ Verification Checklist

Before deploying to production, verify:

- [ ] RLS is enabled on messages, projects, and visits tables
- [ ] All policies are created and active
- [ ] Admin user is configured with `role: "admin"` in metadata
- [ ] Development-friendly policies (`auth.uid() IS NOT NULL`) are removed
- [ ] Service role key is NOT exposed in client-side code
- [ ] Service role key is NOT in environment variables with `NEXT_PUBLIC_` prefix
- [ ] `.env.local` is in `.gitignore`
- [ ] RLS policies have been tested with anonymous, authenticated, and admin users
- [ ] Supabase logging is enabled for monitoring

---

**Last Updated:** Etapa 2 - API Security Hardening
**Requirements:** 6.1-6.9
