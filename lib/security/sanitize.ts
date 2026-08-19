/**
 * HTML sanitization utilities for XSS prevention
 * Requirements covered: 9.1-9.5
 */

/**
 * HTML entities map for escaping special characters
 */
const HTML_ENTITIES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#x27;',
};

/**
 * Escape HTML special characters to prevent XSS attacks
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 * 
 * This function escapes the following characters:
 * - < to &lt;
 * - > to &gt;
 * - & to &amp;
 * - " to &quot;
 * - ' to &#x27;
 * 
 * @param text - Raw text input that may contain HTML special characters
 * @returns Escaped text safe for HTML rendering
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  // Requirement 9.1, 9.2: Escape HTML special characters
  // Requirement 9.3: Preserve original text content
  // Requirement 9.5: Don't remove legitimate characters (apostrophes, ampersands)
  return text.replace(/[<>&"']/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Sanitize contact form data
 * Requirement 9.1: Escape HTML in contact submissions
 * 
 * @param data - Contact form data object
 * @returns Sanitized contact form data
 */
export function sanitizeContactData(data: {
  name: string;
  email: string;
  message: string;
}): {
  name: string;
  email: string;
  message: string;
} {
  return {
    name: escapeHtml(data.name),
    email: escapeHtml(data.email),
    message: escapeHtml(data.message),
  };
}

/**
 * Sanitize project data
 * Requirement 9.2: Escape HTML in project title and description
 * 
 * @param data - Project data object
 * @returns Sanitized project data
 */
export function sanitizeProjectData(data: {
  title: string;
  description: string;
  technologies?: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
}): {
  title: string;
  description: string;
  technologies?: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
} {
  return {
    title: escapeHtml(data.title),
    description: escapeHtml(data.description),
    technologies: data.technologies?.map(escapeHtml),
    github_url: data.github_url,
    live_url: data.live_url,
    image_url: data.image_url,
  };
}

/**
 * Sanitize any string field
 * Generic utility for escaping HTML in any text input
 * 
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export function sanitize(text: string): string {
  return escapeHtml(text);
}

/**
 * Sanitize an object by escaping all string values
 * Useful for sanitizing entire request bodies
 * 
 * @param obj - Object to sanitize
 * @returns New object with all string values escaped
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = escapeHtml(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string' ? escapeHtml(item) : item
      );
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}
