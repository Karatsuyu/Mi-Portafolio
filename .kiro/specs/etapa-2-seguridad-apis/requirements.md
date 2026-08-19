# Requirements Document

## Introduction

This feature addresses critical security vulnerabilities in the Mi-Portafolio application by hardening API endpoints, securing Supabase configuration, implementing rate limiting, anti-spam protection, and enforcing proper security headers. The portfolio application exposes multiple API endpoints (/api/contact, /api/projects, /api/visits) that currently lack comprehensive security controls. This is Phase 2 (Etapa 2) of the PLAN_MAESTRO_FINALIZACION, focused on API security and Supabase hardening for a multi-theme portfolio (Space, Classic, Runic, Cyber) built with Next.js, TypeScript, and Supabase.

## Glossary

- **Contact_API**: The /api/contact endpoint that handles POST (message submission) and GET (message retrieval) operations
- **Projects_API**: The /api/projects endpoint that handles GET (list projects) and POST (create project) operations
- **Visits_API**: The /api/visits endpoint that tracks page visits via GET and POST operations
- **Validation_Engine**: Server-side component responsible for validating, sanitizing, and normalizing all incoming request data
- **Rate_Limiter**: Component that tracks and restricts request frequency from clients to prevent abuse
- **Anti_Spam_System**: Multi-layered defense system including honeypot fields, rate limiting, and validation to block automated bot submissions
- **RLS_Manager**: Supabase Row Level Security policy manager that controls data access at the database level
- **Security_Headers_Module**: HTTP response header configuration that enforces browser security policies
- **Environment_Configuration**: System for managing public and private environment variables across development and production environments
- **Message**: A contact form submission stored in the Supabase "messages" table containing name, email, message text, and timestamp
- **Honeypot_Field**: An invisible form field used to detect and block automated bot submissions
- **Supabase_Client**: The database client initialized with environment variables for connecting to Supabase services

## Requirements

### Requirement 1: Server-Side Validation for Contact API

**User Story:** As a system administrator, I want all contact form submissions to be validated on the server, so that invalid or malicious data cannot be stored in the database.

#### Acceptance Criteria

1. WHEN a POST request is received by Contact_API, THE Validation_Engine SHALL validate that the name field contains 2 to 100 characters
2. WHEN a POST request is received by Contact_API, THE Validation_Engine SHALL validate that the email field matches a valid email format using RFC 5322 compliant regex
3. WHEN a POST request is received by Contact_API, THE Validation_Engine SHALL validate that the message field contains 10 to 2000 characters
4. WHEN a POST request contains a name field exceeding 100 characters, THE Validation_Engine SHALL return HTTP 400 with error message "Name must be between 2 and 100 characters"
5. WHEN a POST request contains a message field with fewer than 10 characters, THE Validation_Engine SHALL return HTTP 400 with error message "Message must be between 10 and 2000 characters"
6. WHEN a POST request contains an invalid email format, THE Validation_Engine SHALL return HTTP 400 with error message "Invalid email format"
7. WHEN a POST request exceeds 10KB payload size, THE Validation_Engine SHALL reject the request with HTTP 413 and error message "Payload too large"
8. WHEN valid text input is received, THE Validation_Engine SHALL trim leading and trailing whitespace from name, email, and message fields
9. WHEN text input contains multiple consecutive spaces, THE Validation_Engine SHALL normalize them to single spaces
10. WHEN all validation passes, THE Contact_API SHALL insert the normalized data into Supabase messages table and return HTTP 201 with success confirmation

### Requirement 2: Eliminate Public Access to Private Messages

**User Story:** As a portfolio owner, I want to prevent public access to my private contact messages, so that visitor submissions remain confidential.

#### Acceptance Criteria

1. THE Contact_API SHALL NOT expose a GET endpoint that returns message data without authentication
2. WHEN an unauthenticated GET request is made to /api/contact, THE Contact_API SHALL return HTTP 401 with error message "Authentication required"
3. WHERE admin access is implemented, THE Contact_API SHALL require valid authentication tokens before returning message data
4. WHEN an authenticated admin requests messages, THE Contact_API SHALL return only messages from the Supabase messages table with proper authorization
5. THE Contact_API SHALL NOT include message data in any public API response accessible to anonymous visitors

### Requirement 3: Rate Limiting for Contact Submissions

**User Story:** As a system administrator, I want to limit the frequency of contact form submissions from individual clients, so that spam attacks and abuse are prevented.

#### Acceptance Criteria

1. WHEN a client submits to Contact_API, THE Rate_Limiter SHALL track the client IP address and submission timestamp
2. WHEN a client submits more than 3 requests to Contact_API within 60 seconds, THE Rate_Limiter SHALL reject subsequent requests with HTTP 429 and error message "Too many requests, please try again later"
3. WHEN 60 seconds have elapsed since the first tracked request, THE Rate_Limiter SHALL reset the request counter for that client IP
4. THE Rate_Limiter SHALL store rate limit data using an in-memory cache with automatic expiration
5. WHEN a rate-limited request is blocked, THE Rate_Limiter SHALL log the client IP and timestamp for security monitoring

### Requirement 4: Rate Limiting for Other Vulnerable Endpoints

**User Story:** As a system administrator, I want to apply rate limiting to Projects_API and Visits_API POST operations, so that write operations cannot be abused.

#### Acceptance Criteria

1. WHEN a client submits to Projects_API POST endpoint, THE Rate_Limiter SHALL allow a maximum of 10 requests per client IP within 60 seconds
2. WHEN a client submits to Visits_API POST endpoint, THE Rate_Limiter SHALL allow a maximum of 100 requests per client IP within 60 seconds
3. WHEN rate limits are exceeded for Projects_API or Visits_API, THE Rate_Limiter SHALL return HTTP 429 with error message "Too many requests, please try again later"
4. THE Rate_Limiter SHALL apply limits independently per endpoint (Contact_API limits do not affect Projects_API limits)

### Requirement 5: Anti-Spam Protection with Honeypot

**User Story:** As a portfolio owner, I want to block automated bot submissions to my contact form, so that I only receive legitimate human messages.

#### Acceptance Criteria

1. WHEN the contact form is rendered, THE Anti_Spam_System SHALL include a honeypot field that is invisible to human users via CSS (position: absolute; left: -9999px)
2. WHEN a POST request to Contact_API includes a non-empty honeypot field, THE Anti_Spam_System SHALL reject the request with HTTP 400 and generic error message "Invalid submission"
3. THE Anti_Spam_System SHALL NOT reveal in error messages that a honeypot field was triggered
4. WHEN a honeypot field is triggered, THE Anti_Spam_System SHALL log the client IP and timestamp for security monitoring
5. THE Anti_Spam_System SHALL validate the honeypot field before performing expensive validation operations

### Requirement 6: Supabase Row Level Security Audit

**User Story:** As a database administrator, I want to verify that Supabase RLS policies are properly configured, so that private data cannot be accessed without authorization.

#### Acceptance Criteria

1. THE RLS_Manager SHALL enable Row Level Security on the messages table
2. THE RLS_Manager SHALL enable Row Level Security on the projects table
3. THE RLS_Manager SHALL enable Row Level Security on the visits table
4. THE RLS_Manager SHALL define a policy for messages table that allows INSERT for anonymous users
5. THE RLS_Manager SHALL define a policy for messages table that allows SELECT only for authenticated admin users
6. THE RLS_Manager SHALL define a policy for projects table that allows SELECT for all users and INSERT/UPDATE/DELETE only for authenticated admin users
7. THE RLS_Manager SHALL define a policy for visits table that allows INSERT for anonymous users and SELECT for all users
8. THE RLS_Manager SHALL NOT use service role keys in client-side code or public environment variables
9. WHERE service role access is required, THE RLS_Manager SHALL restrict service role usage to server-side API routes only

### Requirement 7: Environment Variable Security

**User Story:** As a security administrator, I want to ensure that sensitive credentials are properly protected, so that secrets are not exposed in version control or client-side code.

#### Acceptance Criteria

1. THE Environment_Configuration SHALL store NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables with NEXT_PUBLIC_ prefix for client-side access
2. THE Environment_Configuration SHALL store SUPABASE_SERVICE_ROLE_KEY (if used) without NEXT_PUBLIC_ prefix for server-side only access
3. THE Environment_Configuration SHALL verify that .env files are listed in .gitignore and not committed to version control
4. THE Environment_Configuration SHALL verify that .env.local files are listed in .gitignore and not committed to version control
5. THE Environment_Configuration SHALL provide a .env.example file with placeholder values but no actual secrets
6. WHERE deployment platforms are used, THE Environment_Configuration SHALL verify that production secrets are configured as secure environment variables in the deployment platform
7. THE Environment_Configuration SHALL NOT expose service role keys or private API keys in variables prefixed with NEXT_PUBLIC_

### Requirement 8: Security Headers Configuration

**User Story:** As a security administrator, I want to configure HTTP security headers, so that browsers enforce security policies that protect against common web attacks.

#### Acceptance Criteria

1. THE Security_Headers_Module SHALL set Content-Security-Policy header with directives that allow necessary resources while blocking unsafe inline scripts
2. THE Security_Headers_Module SHALL set X-Content-Type-Options header to "nosniff" to prevent MIME type sniffing
3. THE Security_Headers_Module SHALL set Referrer-Policy header to "strict-origin-when-cross-origin" to control referrer information
4. THE Security_Headers_Module SHALL set Permissions-Policy header to restrict access to sensitive browser features
5. WHEN CSP directives are configured, THE Security_Headers_Module SHALL allow inline styles required by theme switching (Space, Classic, Runic, Cyber themes)
6. WHEN CSP directives are configured, THE Security_Headers_Module SHALL allow image sources from Supabase storage domain
7. WHEN CSP directives are configured, THE Security_Headers_Module SHALL allow connect-src to Supabase API domain for database operations
8. THE Security_Headers_Module SHALL configure headers in next.config.js or middleware.ts without breaking existing functionality
9. WHEN security headers are applied, THE Security_Headers_Module SHALL verify that all themes render correctly and API calls succeed

### Requirement 9: Input Sanitization for XSS Prevention

**User Story:** As a security administrator, I want to sanitize user input to prevent XSS attacks, so that malicious scripts cannot be executed in admin views or stored in the database.

#### Acceptance Criteria

1. WHEN text input is received by Contact_API, THE Validation_Engine SHALL escape HTML special characters (< > & " ') before storage
2. WHEN text input is received by Projects_API, THE Validation_Engine SHALL escape HTML special characters in title and description fields
3. THE Validation_Engine SHALL preserve original text content while escaping only characters that have special meaning in HTML
4. WHEN sanitized data is retrieved from database, THE Validation_Engine SHALL return the escaped version to prevent script execution
5. THE Validation_Engine SHALL NOT remove legitimate characters that are part of normal text (apostrophes in contractions, ampersands in business names)

### Requirement 10: Comprehensive Request Payload Validation

**User Story:** As a system administrator, I want to validate the complete structure of incoming requests, so that only expected data shapes are processed.

#### Acceptance Criteria

1. WHEN a POST request is received by Contact_API, THE Validation_Engine SHALL verify that the Content-Type header is "application/json"
2. WHEN a POST request body cannot be parsed as valid JSON, THE Validation_Engine SHALL return HTTP 400 with error message "Invalid JSON payload"
3. WHEN a POST request to Contact_API contains unexpected fields beyond name, email, message, and honeypot, THE Validation_Engine SHALL ignore extra fields
4. WHEN a POST request to Projects_API is missing required title field, THE Validation_Engine SHALL return HTTP 400 with error message "Title is required"
5. WHEN a POST request to Projects_API is missing required description field, THE Validation_Engine SHALL return HTTP 400 with error message "Description is required"
6. WHEN technologies array in Projects_API contains non-string values, THE Validation_Engine SHALL return HTTP 400 with error message "Technologies must be an array of strings"
7. THE Validation_Engine SHALL validate that URL fields (github_url, live_url, image_url) match valid URL format when provided
8. WHEN an invalid URL format is provided, THE Validation_Engine SHALL return HTTP 400 with error message specifying which URL field is invalid
