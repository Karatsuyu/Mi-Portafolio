/**
 * Security utilities index
 * Central export point for all security-related functions and schemas
 */

// Validation exports
export {
  contactFormSchema,
  projectSchema,
  visitSchema,
  validatePayloadSize,
  validateContentType,
  validateData,
  type ContactFormData,
  type ProjectData,
  type VisitData,
} from './validation';

// Rate limiting exports
export {
  checkRateLimit,
  getClientIdentifier,
  logRateLimitViolation,
  clearRateLimit,
  clearAllRateLimits,
  RATE_LIMITS,
  type RateLimitEndpoint,
} from './rateLimit';

// Sanitization exports
export {
  escapeHtml,
  sanitizeContactData,
  sanitizeProjectData,
  sanitize,
  sanitizeObject,
} from './sanitize';
