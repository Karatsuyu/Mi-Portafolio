# Design Document

## Overview

This design implements comprehensive security hardening for the Mi-Portafolio application's API endpoints and Supabase configuration. The solution addresses critical vulnerabilities identified in Phase 2 (Etapa 2) of the PLAN_MAESTRO_FINALIZACION by implementing server-side validation, rate limiting, anti-spam protection, Row Level Security (RLS) policies, security headers, and proper environment variable management.

### Design Goals

1. **Defense in Depth**: Implement multiple security layers (validation, rate limiting, honeypot, RLS) so that if one layer fails, others provide protection
2. **Zero Trust Input**: Treat all incoming data as potentially malicious until validated
3. **Minimal Attack Surface**: Remove unnecessary public access to sensitive operations (GET /api/contact)
4. **Production Ready**: All security measures must work seamlessly across development and production environments without breaking existing functionality
5. **Performance Conscious**: Security controls should not significantly degrade user experience for legitimate users

### Key Technical Decisions

**Validation Library Choice**: Use `zod` for runtime type validation
- **Rationale**: Zod provides TypeScript-first schema validation with excellent error messages, composability, and zero dependencies. It integrates naturally with Next.js API routes and provides both runtime validation and TypeScript type inference from schemas.
- **Alternative Considered**: `joi` - Rejected due to heavier bundle size and less idiomatic TypeScript support

**Rate Limiting Strategy**: In-memory Map with TTL expiration
- **Rationale**: For a portfolio application with moderate traffic, an in-memory solution is sufficient, requires no external dependencies, and has zero latency. For production scale, this can be upgraded to Redis-backed rate limiting without changing the API.
- **Alternative Considered**: `upstash/ratelimit` with Redis - Deferred to future iteration when traffic patterns justify external infrastructure

**Security Headers Implementation**: Next.js middleware
- **Rationale**: Middleware runs on all routes automatically and can set headers before any route handler executes. This ensures consistent security header application across all endpoints.
- **Alternative Considered**: `next.config.js` headers - Less flexible for conditional logic and harder to test

**HTML Escaping Approach**: Custom utility function
- **Rationale**: HTML escaping is a simple operation (5 character replacements) that doesn't justify a library dependency. A well-tested utility function is sufficient and reduces bundle size.
- **Alternative Considered**: `he` library - Rejected due to unnecessary complexity for our use case

## Architecture

### System Context

```mermaid
graph TB
    Client[Client Browser]
    Middleware[Next.js Middleware]
    ContactAPI[Contact API Route]
    ProjectsAPI[Projects API Route]
    VisitsAPI[Visits API Route]
    ValidationEngine[Validation Engine]
    RateLimiter[Rate Limiter]
    AntiSpam[Anti-Spam System]
    Supabase[(Supabase Database)]
    
    Client -->|HTTP Request| Middleware
    Middleware -->|Security Headers| Client
    Middleware --> ContactAPI
    Middleware --> ProjectsAPI
    Middleware --> VisitsAPI
    
    ContactAPI --> AntiSpam
    AntiSpam --> RateLimiter
    RateLimiter --> ValidationEngine
    
    ProjectsAPI --> RateLimiter
    VisitsAPI --> RateLimiter
    
    ValidationEngine --> Supabase
    RateLimiter --> Supabase
    
    Supabase -->|RLS Policies| Supabase
