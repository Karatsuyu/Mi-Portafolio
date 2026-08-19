import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Security Headers
 * Requirements covered: 8.1-8.9 (Security Headers Configuration)
 * 
 * This middleware runs on all routes and applies comprehensive security headers
 * to protect against common web vulnerabilities.
 */

export function middleware(request: NextRequest) {
  // Clone the response to modify headers
  const response = NextResponse.next();

  // ═══════════════════════════════════════════════════════════════════════════
  // Content Security Policy (CSP) - Requirement 8.1, 8.5, 8.6, 8.7
  // ═══════════════════════════════════════════════════════════════════════════
  const cspDirectives = [
    // Default: only same origin
    "default-src 'self'",
    
    // Scripts: self + unsafe-inline for Next.js hydration + unsafe-eval for development
    // Note: unsafe-inline and unsafe-eval should be removed in strict production CSP
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    
    // Styles: self + unsafe-inline for dynamic theming and Tailwind + Font Awesome CDN (Requirement 8.5)
    // The portfolio uses inline styles for theme switching across Space/Classic/Runic/Cyber
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
    
    // Images: self + data URIs + Supabase storage (Requirement 8.6)
    "img-src 'self' data: https://*.supabase.co https://*.supabase.in blob:",
    
    // Fonts: self + Google Fonts + Font Awesome CDN + data URIs
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:",
    
    // Connect: self + Supabase API for database operations (Requirement 8.7)
    "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co",
    
    // Media: self + blob for generated content
    "media-src 'self' blob:",
    
    // Objects: none (no Flash, Java applets, etc.)
    "object-src 'none'",
    
    // Base URI: restrict to same origin
    "base-uri 'self'",
    
    // Form actions: only same origin
    "form-action 'self'",
    
    // Frame ancestors: prevent clickjacking
    "frame-ancestors 'none'",
    
    // Upgrade insecure requests in production
    "upgrade-insecure-requests",
  ];

  response.headers.set(
    'Content-Security-Policy',
    cspDirectives.join('; ')
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // X-Content-Type-Options - Requirement 8.2
  // ═══════════════════════════════════════════════════════════════════════════
  // Prevents browsers from MIME-sniffing a response away from the declared content-type
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // ═══════════════════════════════════════════════════════════════════════════
  // Referrer-Policy - Requirement 8.3
  // ═══════════════════════════════════════════════════════════════════════════
  // Controls how much referrer information is sent with requests
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // ═══════════════════════════════════════════════════════════════════════════
  // Permissions-Policy - Requirement 8.4
  // ═══════════════════════════════════════════════════════════════════════════
  // Restricts access to sensitive browser features
  const permissionsPolicyDirectives = [
    'camera=()',           // No camera access
    'microphone=()',       // No microphone access
    'geolocation=()',      // No geolocation access
    'payment=()',          // No payment request API
    'usb=()',              // No USB access
    'magnetometer=()',     // No magnetometer access
    'gyroscope=()',        // No gyroscope access
    'accelerometer=()',    // No accelerometer access
  ];

  response.headers.set(
    'Permissions-Policy',
    permissionsPolicyDirectives.join(', ')
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // Additional Security Headers (Best Practices)
  // ═══════════════════════════════════════════════════════════════════════════
  
  // X-Frame-Options: Prevent clickjacking (backup for CSP frame-ancestors)
  response.headers.set('X-Frame-Options', 'DENY');

  // X-XSS-Protection: Legacy XSS protection for older browsers
  // Note: Modern browsers rely on CSP instead
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Strict-Transport-Security: Enforce HTTPS (only in production)
  // This should be configured at the server/CDN level, but we include it here as well
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

/**
 * Matcher configuration: Apply middleware to all routes except static assets
 * 
 * We exclude:
 * - _next/static (Next.js static files)
 * - _next/image (Next.js image optimization)
 * - favicon.ico and other static assets
 * 
 * This ensures security headers are applied to all HTML pages and API routes
 * while avoiding unnecessary processing for static files.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt (static files)
     * - public folder files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|woff|woff2|ttf|eot)).*)',
  ],
};
