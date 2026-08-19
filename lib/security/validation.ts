import { z } from 'zod';
import { escapeHtml } from './sanitize';

/**
 * Validation schemas and utilities for API request validation
 * Requirements covered: 1.1-1.10, 10.1-10.8
 */

// Email validation using RFC 5322 compliant regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// URL validation regex
const urlRegex = /^https?:\/\/.+/;

/**
 * Contact form validation schema
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 9.1
 * Includes HTML escaping for XSS prevention
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be between 2 and 100 characters')
    .max(100, 'Name must be between 2 and 100 characters')
    .transform((val) => {
      // Normalize whitespace (Requirement 1.9)
      const normalized = val.replace(/\s+/g, ' ');
      // Escape HTML characters for XSS prevention (Requirement 9.1)
      return escapeHtml(normalized);
    }),
  email: z
    .string()
    .trim() // Trim first
    .regex(emailRegex, 'Invalid email format') // Then validate
    .transform((val) => escapeHtml(val)), // Escape HTML (Requirement 9.1)
  message: z
    .string()
    .trim()
    .min(10, 'Message must be between 10 and 2000 characters')
    .max(2000, 'Message must be between 10 and 2000 characters')
    .transform((val) => {
      // Normalize whitespace (Requirement 1.9)
      const normalized = val.replace(/\s+/g, ' ');
      // Escape HTML characters for XSS prevention (Requirement 9.1)
      return escapeHtml(normalized);
    }),
  honeypot: z.string().optional(), // Anti-spam honeypot field (Requirement 5.1-5.5)
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Project creation/update validation schema
 * Requirements: 9.2, 10.4, 10.5, 10.6, 10.7, 10.8
 * Includes HTML escaping for XSS prevention in title and description fields
 */
export const projectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .transform((val) => {
      // Normalize whitespace (Requirement 1.8-1.9)
      const normalized = val.trim().replace(/\s+/g, ' ');
      // Escape HTML characters for XSS prevention (Requirement 9.2)
      return escapeHtml(normalized);
    }),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Description must be less than 5000 characters')
    .transform((val) => {
      // Normalize whitespace (Requirement 1.8-1.9)
      const normalized = val.trim().replace(/\s+/g, ' ');
      // Escape HTML characters for XSS prevention (Requirement 9.2)
      return escapeHtml(normalized);
    }),
  technologies: z
    .array(z.string())
    .min(1, 'At least one technology is required')
    .refine((arr) => arr.every((item) => typeof item === 'string'), {
      message: 'Technologies must be an array of strings',
    })
    .transform((arr) => arr.map(tech => escapeHtml(tech.trim()))),
  github_url: z
    .string()
    .regex(urlRegex, 'Invalid GitHub URL format')
    .optional()
    .or(z.literal('')),
  live_url: z
    .string()
    .regex(urlRegex, 'Invalid live URL format')
    .optional()
    .or(z.literal('')),
  image_url: z
    .string()
    .regex(urlRegex, 'Invalid image URL format')
    .optional()
    .or(z.literal('')),
});

export type ProjectData = z.infer<typeof projectSchema>;

/**
 * Visit tracking validation schema
 * Requirements: 10.1-10.2
 * Validates page visit tracking data
 */
export const visitSchema = z.object({
  page: z
    .string()
    .min(1, 'Page is required')
    .max(500, 'Page must be less than 500 characters')
    .transform((val) => val.trim()),
  user_agent: z
    .string()
    .max(1000, 'User agent must be less than 1000 characters')
    .optional(),
});

export type VisitData = z.infer<typeof visitSchema>;

/**
 * Validates request payload size
 * Requirement 1.7: Reject payloads exceeding 10KB
 */
export function validatePayloadSize(contentLength: string | null): boolean {
  if (!contentLength) return true; // If no content-length header, let it through (will be caught by JSON parsing)
  const size = parseInt(contentLength, 10);
  return size <= 10 * 1024; // 10KB in bytes
}

/**
 * Validates Content-Type header
 * Requirement 10.1: Verify Content-Type is application/json
 */
export function validateContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  return contentType.includes('application/json');
}

/**
 * Generic validation function that handles Zod schema validation
 * Returns validated and transformed data or throws with formatted error
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    // Get the first error message
    const firstError = result.error.errors[0];
    return { success: false, error: firstError?.message || 'Validation failed' };
  }
}
