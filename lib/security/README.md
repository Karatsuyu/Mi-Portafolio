# Security Infrastructure

This directory contains security utilities for API endpoint hardening in the Mi-Portafolio application.

## Overview

The security infrastructure implements:
- **Server-side validation** using Zod schemas
- **Rate limiting** to prevent abuse
- **HTML sanitization** to prevent XSS attacks
- **Request payload validation**

## Modules

### `validation.ts`

Provides Zod schemas and validation utilities for:
- Contact form submissions (name, email, message)
- Project data (title, description, technologies, URLs)
- Visit tracking data
- Content-Type and payload size validation

**Key Features:**
- RFC 5322 compliant email validation
- URL format validation
- Automatic whitespace trimming and normalization
- Configurable field length limits
- 10KB payload size limit

**Requirements Covered:** 1.1-1.10, 10.1-10.8

### `rateLimit.ts`

In-memory rate limiting implementation with:
- Configurable limits per endpoint
- Per-client IP tracking
- Automatic cleanup of expired entries
- Independent limits per endpoint

**Rate Limits:**
- Contact API: 3 requests per 60 seconds
- Projects API: 10 requests per 60 seconds
- Visits API: 100 requests per 60 seconds

**Requirements Covered:** 3.1-3.5, 4.1-4.4

### `sanitize.ts`

HTML escaping utilities to prevent XSS attacks:
- Escapes `<`, `>`, `&`, `"`, `'` characters
- Preserves legitimate text content
- Specialized functions for contact and project data

**Requirements Covered:** 9.1-9.5

### `index.ts`

Central export point for all security utilities, providing a clean import interface.

## Usage Examples

### Validation

```typescript
import { contactFormSchema, validateData } from '@/lib/security';

const result = validateData(contactFormSchema, requestData);
if (result.success) {
  // Use validated data
  const { name, email, message } = result.data;
} else {
  // Handle validation error
  return new Response(JSON.stringify({ error: result.error }), { status: 400 });
}
```

### Rate Limiting

```typescript
import { checkRateLimit, getClientIdentifier } from '@/lib/security';

const clientId = getClientIdentifier(request);
const rateLimit = checkRateLimit(clientId, 'CONTACT');

if (!rateLimit.allowed) {
  return new Response(
    JSON.stringify({ error: 'Too many requests, please try again later' }),
    { status: 429 }
  );
}
```

### Sanitization

```typescript
import { sanitizeContactData } from '@/lib/security';

const sanitized = sanitizeContactData({
  name: userInput.name,
  email: userInput.email,
  message: userInput.message,
});
```

## Testing

Run the test suite:

```bash
npm test
```

The test suite includes 28 tests covering:
- Validation schemas for all data types
- Rate limiting behavior and limits
- HTML escaping and sanitization
- Edge cases and error conditions

## Dependencies

- **zod** (^3.22.4): TypeScript-first schema validation library

## Requirements Coverage

This infrastructure supports the following requirements from the design document:

- **Requirement 1**: Server-Side Validation for Contact API
- **Requirement 3**: Rate Limiting for Contact Submissions
- **Requirement 4**: Rate Limiting for Other Vulnerable Endpoints
- **Requirement 9**: Input Sanitization for XSS Prevention
- **Requirement 10**: Comprehensive Request Payload Validation

## Next Steps

This infrastructure will be integrated into API routes in subsequent tasks:
1. Task 2: Update Contact API with validation and rate limiting
2. Task 3: Update Projects API with validation and rate limiting
3. Task 4: Update Visits API with rate limiting
4. Task 5: Implement security headers middleware
5. Task 6: Add Supabase RLS policies
