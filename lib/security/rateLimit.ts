/**
 * Rate limiting implementation using in-memory storage
 * Requirements covered: 3.1-3.5, 4.1-4.4
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory storage for rate limit tracking
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval to remove expired entries (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let cleanupTimer: NodeJS.Timeout | null = null;

/**
 * Start periodic cleanup of expired rate limit entries
 */
function startCleanup() {
  if (cleanupTimer) return; // Already running
  
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    // Collect keys to delete
    rateLimitStore.forEach((entry, key) => {
      if (now > entry.resetTime) {
        keysToDelete.push(key);
      }
    });
    
    // Delete expired entries
    keysToDelete.forEach(key => rateLimitStore.delete(key));
  }, CLEANUP_INTERVAL);
}

// Start cleanup on module load
if (typeof window === 'undefined') {
  // Only run on server-side
  startCleanup();
}

/**
 * Rate limit configuration per endpoint
 */
export const RATE_LIMITS = {
  CONTACT: {
    maxRequests: 3,
    windowMs: 60 * 1000, // 60 seconds (Requirement 3.2, 3.3)
  },
  PROJECTS: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 60 seconds (Requirement 4.1)
  },
  VISITS: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 60 seconds (Requirement 4.2)
  },
} as const;

export type RateLimitEndpoint = keyof typeof RATE_LIMITS;

/**
 * Check if a request should be rate limited
 * Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4
 * 
 * @param identifier - Unique identifier for the client (typically IP address)
 * @param endpoint - The endpoint being accessed
 * @returns Object indicating if request is allowed and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  endpoint: RateLimitEndpoint
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const config = RATE_LIMITS[endpoint];
  const key = `${endpoint}:${identifier}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  // No entry or entry expired - allow request and create new entry
  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitStore.set(key, {
      count: 1,
      resetTime,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  // Entry exists and not expired - check if limit exceeded
  if (entry.count >= config.maxRequests) {
    // Requirement 3.2: Reject subsequent requests with HTTP 429
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment counter and allow request
  entry.count += 1;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client identifier from request
 * Extracts IP address from various headers (considering proxies)
 * 
 * @param request - Next.js Request object
 * @returns Client identifier (IP address)
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from common proxy headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Fallback to a generic identifier if IP cannot be determined
  // In production, you might want to use a different strategy
  return 'unknown-ip';
}

/**
 * Log rate limit violation for security monitoring
 * Requirement 3.5: Log blocked requests
 * 
 * @param identifier - Client identifier
 * @param endpoint - Endpoint that was rate limited
 */
export function logRateLimitViolation(identifier: string, endpoint: RateLimitEndpoint): void {
  const timestamp = new Date().toISOString();
  console.warn(`[RATE_LIMIT] ${timestamp} - Client ${identifier} exceeded rate limit for ${endpoint}`);
}

/**
 * Clear rate limit for a specific identifier and endpoint
 * Useful for testing or administrative purposes
 */
export function clearRateLimit(identifier: string, endpoint: RateLimitEndpoint): void {
  const key = `${endpoint}:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * Clear all rate limits
 * Useful for testing purposes
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}
