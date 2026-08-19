# Implementation Plan: API Security Hardening (Etapa 2)

## Overview

This implementation plan secures the Mi-Portafolio API endpoints through comprehensive validation, rate limiting, anti-spam protection, Row Level Security policies, security headers, and proper environment variable management. The implementation follows a defense-in-depth approach with multiple security layers protecting the Contact, Projects, and Visits APIs.

## Tasks

- [x] 1. Set up security infrastructure and utilities
  - Install zod validation library (`npm install zod`)
  - Create `lib/security/` directory structure for security modules
  - Create `lib/security/validation.ts` for validation schemas and utilities
  - Create `lib/security/rateLimit.ts` for rate limiting implementation
  - Create `lib/security/sanitize.ts` for HTML escaping utility
  - _Requirements: 1.1-1.10, 9.1-9.5, 10.1-10.8_

- [x] 2. Implement validation schemas with Zod
  - [x] 2.1 Create contact form validation schema
    - Define schema for name (2-100 chars), email (RFC 5322), message (10-2000 chars)
    - Add honeypot field validation
    - Add payload size limit check (10KB max)
    - Include whitespace trimming and normalization logic
    - _Requirements: 1.1-1.3, 1.7-1.9, 5.2_
  
  - [x] 2.2 Create projects validation schema
    - Define schema for title (required), description (required)
    - Add URL validation for github_url, live_url, image_url (optional)
    - Add technologies array validation (must be strings)
    - Include HTML escaping for title and description fields
    - _Requirements: 9.2, 10.4-10.8_
  
  - [x] 2.3 Create visits validation schema
    - Define schema for page (required string)
    - Add user_agent validation (optional string)
    - _Requirements: 10.1-10.2_
  
  - [ ]* 2.4 Write unit tests for validation schemas
    - Test valid inputs pass validation
    - Test boundary conditions (min/max lengths)
    - Test invalid email formats rejection
    - Test payload size limits
    - Test HTML character escaping
    - Test URL format validation
    - _Requirements: 1.1-1.10, 9.1-9.5, 10.1-10.8_

- [x] 3. Implement HTML sanitization utility
  - [x] 3.1 Create escapeHtml function
    - Escape special characters: < > & " '
    - Preserve original text content (apostrophes, ampersands in normal text)
    - Export reusable utility function
    - _Requirements: 9.1-9.5_
  
  - [ ]* 3.2 Write unit tests for HTML sanitization
    - Test script tags are escaped
    - Test HTML entities are escaped
    - Test normal text with apostrophes preserved
    - Test ampersands in business names preserved
    - _Requirements: 9.1-9.5_

- [x] 4. Implement in-memory rate limiter
  - [x] 4.1 Create RateLimiter class with TTL expiration
    - Implement in-memory Map to track IP addresses and timestamps
    - Add automatic cleanup for expired entries (60 second windows)
    - Create check method that returns boolean (allowed/blocked)
    - Add logging for rate limit violations
    - _Requirements: 3.1-3.5, 4.1-4.4_
  
  - [x] 4.2 Create endpoint-specific rate limit configurations
    - Contact API: 3 requests per 60 seconds per IP
    - Projects API POST: 10 requests per 60 seconds per IP
    - Visits API POST: 100 requests per 60 seconds per IP
    - Independent counters per endpoint
    - _Requirements: 3.1-3.5, 4.1-4.4_
  
  - [ ]* 4.3 Write unit tests for rate limiter
    - Test rate limit counter increments
    - Test rate limit blocks after threshold
    - Test counter resets after time window
    - Test independent limits per endpoint
    - Test IP extraction and logging
    - _Requirements: 3.1-3.5, 4.1-4.4_

- [ ] 5. Checkpoint - Ensure security utilities are working
  - Run all tests and verify they pass
  - Ensure validation schemas correctly reject invalid inputs
  - Ensure rate limiter properly tracks and resets counters
  - Ask the user if questions arise

- [x] 6. Secure Contact API endpoint
  - [x] 6.1 Remove public GET endpoint from /api/contact
    - Replace GET handler with 401 authentication required response
    - Add error message "Authentication required"
    - Document that admin access requires authentication implementation
    - _Requirements: 2.1-2.5_
  
  - [x] 6.2 Add honeypot validation to Contact API POST
    - Check honeypot field before expensive operations
    - Return generic 400 error if honeypot is filled
    - Log honeypot triggers for security monitoring
    - Do not reveal honeypot detection in error messages
    - _Requirements: 5.1-5.5_
  
  - [x] 6.3 Add rate limiting to Contact API POST
    - Apply 3 requests per 60 seconds limit
    - Return HTTP 429 "Too many requests, please try again later"
    - Extract client IP from request headers (x-forwarded-for, x-real-ip)
    - Log rate limit violations with IP and timestamp
    - _Requirements: 3.1-3.5_
  
  - [x] 6.4 Add comprehensive validation to Contact API POST
    - Validate Content-Type is application/json
    - Apply Zod schema validation for name, email, message
    - Return specific validation error messages (400 status)
    - Normalize whitespace before database insertion
    - Escape HTML characters in all text fields
    - _Requirements: 1.1-1.10, 9.1-9.5, 10.1-10.3_
  
  - [ ]* 6.5 Write integration tests for secured Contact API
    - Test honeypot field blocks submission
    - Test rate limiting blocks after 3 requests
    - Test validation rejects invalid inputs
    - Test valid submission succeeds
    - Test GET endpoint returns 401
    - _Requirements: 1.1-1.10, 2.1-2.5, 3.1-3.5, 5.1-5.5_

- [x] 7. Secure Projects API endpoint
  - [x] 7.1 Add rate limiting to Projects API POST
    - Apply 10 requests per 60 seconds limit
    - Return HTTP 429 with appropriate error message
    - Extract client IP from request headers
    - _Requirements: 4.1-4.4_
  
  - [x] 7.2 Add comprehensive validation to Projects API POST
    - Validate Content-Type is application/json
    - Apply Zod schema for title, description (required)
    - Validate URL formats for github_url, live_url, image_url (optional)
    - Validate technologies array contains only strings
    - Escape HTML in title and description fields
    - _Requirements: 9.2, 10.4-10.8_
  
  - [ ]* 7.3 Write integration tests for secured Projects API
    - Test rate limiting blocks after 10 requests
    - Test missing title returns 400 error
    - Test missing description returns 400 error
    - Test invalid URL format rejection
    - Test technologies array with non-strings rejected
    - Test valid project creation succeeds
    - _Requirements: 4.1-4.4, 9.2, 10.4-10.8_

- [x] 8. Secure Visits API endpoint
  - [x] 8.1 Add rate limiting to Visits API POST
    - Apply 100 requests per 60 seconds limit
    - Return HTTP 429 with appropriate error message
    - Extract client IP from request headers
    - _Requirements: 4.1-4.4_
  
  - [x] 8.2 Add validation to Visits API POST
    - Validate Content-Type is application/json
    - Apply Zod schema for page (required) and user_agent (optional)
    - Return appropriate 400 error for invalid payloads
    - _Requirements: 10.1-10.2_
  
  - [ ]* 8.3 Write integration tests for secured Visits API
    - Test rate limiting blocks after 100 requests
    - Test missing page field returns 400
    - Test valid visit recording succeeds
    - _Requirements: 4.1-4.4, 10.1-10.2_

- [x] 9. Checkpoint - Ensure all API endpoints are secured
  - Run all integration tests and verify they pass
  - Manually test each endpoint with valid and invalid data
  - Verify rate limiting works correctly across endpoints
  - Ask the user if questions arise

- [x] 10. Add honeypot field to contact forms
  - [x] 10.1 Add honeypot field to contact form components
    - Add hidden input field with CSS (position: absolute; left: -9999px)
    - Name field distinctly (e.g., "website" or "company")
    - Add to Space theme contact form
    - Add to Classic theme contact form
    - Add to Runic theme contact form
    - Add to Cyber theme contact form
    - _Requirements: 5.1-5.3_
  
  - [ ]* 10.2 Write visual regression tests for contact forms
    - Verify honeypot field is not visible to users
    - Verify form layout is unchanged
    - Test across all four themes
    - _Requirements: 5.1-5.2_

- [x] 11. Implement security headers middleware
  - [x] 11.1 Create Next.js middleware.ts file
    - Set Content-Security-Policy with appropriate directives
    - Allow inline styles for theme switching
    - Allow image sources from Supabase storage domain
    - Allow connect-src to Supabase API domain
    - Set X-Content-Type-Options: nosniff
    - Set Referrer-Policy: strict-origin-when-cross-origin
    - Set Permissions-Policy to restrict sensitive features
    - _Requirements: 8.1-8.9_
  
  - [x] 11.2 Configure CSP for application requirements
    - Add Supabase domain to connect-src directive
    - Allow unsafe-inline styles for dynamic theming
    - Allow self for scripts and images
    - Test that all themes render correctly
    - Test that API calls to Supabase succeed
    - _Requirements: 8.5-8.9_
  
  - [ ]* 11.3 Write integration tests for security headers
    - Verify all security headers are present in responses
    - Test CSP allows required resources
    - Test CSP blocks unauthorized resources
    - Verify all themes render without CSP violations
    - _Requirements: 8.1-8.9_

- [x] 12. Implement Supabase Row Level Security policies
  - [x] 12.1 Create RLS policy SQL scripts
    - Enable RLS on messages table
    - Enable RLS on projects table
    - Enable RLS on visits table
    - Create INSERT policy for messages (anonymous allowed)
    - Create SELECT policy for messages (authenticated admin only)
    - Create SELECT policy for projects (all users allowed)
    - Create INSERT/UPDATE/DELETE policies for projects (authenticated admin only)
    - Create INSERT policy for visits (anonymous allowed)
    - Create SELECT policy for visits (all users allowed)
    - _Requirements: 6.1-6.9_
  
  - [x] 12.2 Document RLS policy application
    - Create SQL migration file in `supabase/migrations/` directory
    - Add instructions for applying policies via Supabase dashboard
    - Document service role key restrictions (server-side only)
    - _Requirements: 6.1-6.9_
  
  - [ ]* 12.3 Write integration tests for RLS policies
    - Test anonymous users can insert messages
    - Test anonymous users cannot select messages
    - Test anonymous users can insert visits
    - Test all users can select projects
    - Test anonymous users cannot insert/update/delete projects
    - _Requirements: 6.1-6.9_

- [x] 13. Audit and secure environment variables
  - [x] 13.1 Review environment variable configuration
    - Verify NEXT_PUBLIC_SUPABASE_ANON_KEY has NEXT_PUBLIC_ prefix
    - Verify SUPABASE_SERVICE_ROLE_KEY (if exists) lacks NEXT_PUBLIC_ prefix
    - Check .env and .env.local are in .gitignore
    - Verify no secrets are committed to version control
    - _Requirements: 7.1-7.7_
  
  - [x] 13.2 Create .env.example file
    - Add placeholder values for all required environment variables
    - Add comments explaining each variable's purpose
    - Include NEXT_PUBLIC_SUPABASE_URL placeholder
    - Include NEXT_PUBLIC_SUPABASE_ANON_KEY placeholder
    - Do not include actual secret values
    - _Requirements: 7.5_
  
  - [x] 13.3 Document environment variable security
    - Create documentation explaining public vs private variables
    - Add deployment instructions for secure environment variables
    - Document that service role keys must never be client-accessible
    - _Requirements: 7.1-7.7_

- [x] 14. Final integration and testing
  - [x] 14.1 End-to-end security testing
    - Test contact form submission with valid data succeeds
    - Test contact form blocks rapid submissions (rate limit)
    - Test contact form blocks bot submissions (honeypot)
    - Test invalid inputs are rejected with appropriate errors
    - Test all four themes work correctly with security headers
    - Test Supabase RLS policies enforce access control
    - _Requirements: All_

  - [ ]* 14.2 Security audit and documentation
    - Review all API endpoints for security compliance
    - Document security architecture and controls
    - Create runbook for security incident response
    - Document rate limit thresholds and rationale
    - _Requirements: All_

- [x] 15. Final checkpoint - Complete security audit
  - Ensure all tests pass across validation, rate limiting, and RLS
  - Verify no sensitive data is exposed in public APIs
  - Verify environment variables are properly secured
  - Test all themes render correctly with security headers
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Security implementation follows defense-in-depth principle with multiple layers
- Rate limiting uses in-memory storage suitable for portfolio traffic patterns
- Zod provides runtime validation with TypeScript type inference
- RLS policies must be applied in Supabase dashboard or via SQL migrations
- Security headers are applied via Next.js middleware for consistent enforcement
- Honeypot field is invisible CSS technique to block automated bots
