/**
 * Tests for security utilities
 * Verifies validation, rate limiting, and sanitization functions
 */

import {
  contactFormSchema,
  projectSchema,
  visitSchema,
  validateData,
  validatePayloadSize,
  validateContentType,
  checkRateLimit,
  clearRateLimit,
  clearAllRateLimits,
  escapeHtml,
  sanitizeContactData,
  sanitizeProjectData,
} from '../index';

describe('Validation Utilities', () => {
  describe('contactFormSchema', () => {
    it('should validate correct contact form data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message with sufficient length.',
        honeypot: '',
      };

      const result = validateData(contactFormSchema, validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John Doe');
        expect(result.data.email).toBe('john@example.com');
      }
    });

    it('should reject name shorter than 2 characters', () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        message: 'This is a test message.',
      };

      const result = validateData(contactFormSchema, invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Name must be between 2 and 100 characters');
      }
    });

    it('should reject name longer than 100 characters', () => {
      const invalidData = {
        name: 'A'.repeat(101),
        email: 'john@example.com',
        message: 'This is a test message.',
      };

      const result = validateData(contactFormSchema, invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Name must be between 2 and 100 characters');
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'This is a test message.',
      };

      const result = validateData(contactFormSchema, invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Invalid email format');
      }
    });

    it('should reject message shorter than 10 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
      };

      const result = validateData(contactFormSchema, invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Message must be between 10 and 2000 characters');
      }
    });

    it('should trim whitespace and normalize spaces', () => {
      const dataWithSpaces = {
        name: '  John   Doe  ',
        email: '  john@example.com  ',
        message: '  This  is   a   test   message with enough characters to pass validation.  ',
      };

      const result = validateData(contactFormSchema, dataWithSpaces);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John Doe');
        expect(result.data.email).toBe('john@example.com');
        expect(result.data.message).toBe('This is a test message with enough characters to pass validation.');
      }
    });
  });

  describe('projectSchema', () => {
    it('should validate correct project data', () => {
      const validData = {
        title: 'Test Project',
        description: 'A test project description',
        technologies: ['React', 'TypeScript'],
        github_url: 'https://github.com/test/project',
        live_url: 'https://example.com',
      };

      const result = validateData(projectSchema, validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing title', () => {
      const invalidData = {
        description: 'A test project description',
        technologies: ['React'],
      };

      const result = validateData(projectSchema, invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.toLowerCase()).toContain('required');
      }
    });

    it('should reject invalid URL format', () => {
      const invalidData = {
        title: 'Test Project',
        description: 'A test project description',
        technologies: ['React'],
        github_url: 'not-a-url',
      };

      const result = validateData(projectSchema, invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Invalid GitHub URL format');
      }
    });
  });

  describe('visitSchema', () => {
    it('should validate correct visit data', () => {
      const validData = {
        page: '/home',
        user_agent: 'Mozilla/5.0',
      };

      const result = validateData(visitSchema, validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe('/home');
        expect(result.data.user_agent).toBe('Mozilla/5.0');
      }
    });

    it('should validate visit data without user_agent', () => {
      const validData = {
        page: '/about',
      };

      const result = validateData(visitSchema, validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe('/about');
        expect(result.data.user_agent).toBeUndefined();
      }
    });

    it('should reject missing page field', () => {
      const invalidData = {
        user_agent: 'Mozilla/5.0',
      };

      const result = validateData(visitSchema, invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.toLowerCase()).toContain('required');
      }
    });

    it('should trim whitespace from page field', () => {
      const dataWithSpaces = {
        page: '  /contact  ',
        user_agent: 'Mozilla/5.0',
      };

      const result = validateData(visitSchema, dataWithSpaces);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe('/contact');
      }
    });
  });

  describe('validatePayloadSize', () => {
    it('should accept payload under 10KB', () => {
      expect(validatePayloadSize('5000')).toBe(true);
    });

    it('should reject payload over 10KB', () => {
      expect(validatePayloadSize('11000')).toBe(false);
    });

    it('should accept null content-length', () => {
      expect(validatePayloadSize(null)).toBe(true);
    });
  });

  describe('validateContentType', () => {
    it('should accept application/json', () => {
      expect(validateContentType('application/json')).toBe(true);
    });

    it('should accept application/json with charset', () => {
      expect(validateContentType('application/json; charset=utf-8')).toBe(true);
    });

    it('should reject non-JSON content type', () => {
      expect(validateContentType('text/plain')).toBe(false);
    });

    it('should reject null content type', () => {
      expect(validateContentType(null)).toBe(false);
    });
  });
});

describe('Rate Limiting', () => {
  beforeEach(() => {
    clearAllRateLimits();
  });

  it('should allow requests within rate limit', () => {
    const result1 = checkRateLimit('test-ip', 'CONTACT');
    expect(result1.allowed).toBe(true);
    expect(result1.remaining).toBe(2); // 3 max - 1 = 2 remaining

    const result2 = checkRateLimit('test-ip', 'CONTACT');
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(1);
  });

  it('should block requests exceeding rate limit', () => {
    // Use up all 3 requests
    checkRateLimit('test-ip', 'CONTACT');
    checkRateLimit('test-ip', 'CONTACT');
    checkRateLimit('test-ip', 'CONTACT');

    // 4th request should be blocked
    const result = checkRateLimit('test-ip', 'CONTACT');
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should apply limits independently per endpoint', () => {
    // Exhaust CONTACT limit
    checkRateLimit('test-ip', 'CONTACT');
    checkRateLimit('test-ip', 'CONTACT');
    checkRateLimit('test-ip', 'CONTACT');
    const contactResult = checkRateLimit('test-ip', 'CONTACT');
    expect(contactResult.allowed).toBe(false);

    // PROJECTS should still be allowed
    const projectsResult = checkRateLimit('test-ip', 'PROJECTS');
    expect(projectsResult.allowed).toBe(true);
  });

  it('should apply limits independently per IP', () => {
    // Exhaust limit for ip1
    checkRateLimit('ip1', 'CONTACT');
    checkRateLimit('ip1', 'CONTACT');
    checkRateLimit('ip1', 'CONTACT');
    const ip1Result = checkRateLimit('ip1', 'CONTACT');
    expect(ip1Result.allowed).toBe(false);

    // ip2 should still be allowed
    const ip2Result = checkRateLimit('ip2', 'CONTACT');
    expect(ip2Result.allowed).toBe(true);
  });

  it('should clear rate limit for specific identifier', () => {
    // Exhaust limit
    checkRateLimit('test-ip', 'CONTACT');
    checkRateLimit('test-ip', 'CONTACT');
    checkRateLimit('test-ip', 'CONTACT');
    expect(checkRateLimit('test-ip', 'CONTACT').allowed).toBe(false);

    // Clear and try again
    clearRateLimit('test-ip', 'CONTACT');
    const result = checkRateLimit('test-ip', 'CONTACT');
    expect(result.allowed).toBe(true);
  });

  it('should apply VISITS rate limit (100 requests per 60 seconds)', () => {
    // Make 100 requests (should all succeed)
    for (let i = 0; i < 100; i++) {
      const result = checkRateLimit('test-ip', 'VISITS');
      expect(result.allowed).toBe(true);
    }

    // 101st request should be blocked
    const blockedResult = checkRateLimit('test-ip', 'VISITS');
    expect(blockedResult.allowed).toBe(false);
    expect(blockedResult.remaining).toBe(0);
  });
});

describe('Sanitization', () => {
  describe('escapeHtml', () => {
    it('should escape < and >', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });

    it('should escape &', () => {
      expect(escapeHtml('Company & Co')).toBe('Company &amp; Co');
    });

    it('should escape quotes', () => {
      expect(escapeHtml('He said "Hello" and \'Goodbye\'')).toBe(
        'He said &quot;Hello&quot; and &#x27;Goodbye&#x27;'
      );
    });

    it('should preserve normal text', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
    });

    it('should preserve apostrophes in contractions', () => {
      const result = escapeHtml("don't");
      expect(result).toBe("don&#x27;t");
    });
  });

  describe('sanitizeContactData', () => {
    it('should sanitize all contact form fields', () => {
      const data = {
        name: '<script>alert("xss")</script>',
        email: 'test@example.com',
        message: 'Hello <b>World</b>',
      };

      const sanitized = sanitizeContactData(data);
      expect(sanitized.name).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(sanitized.email).toBe('test@example.com');
      expect(sanitized.message).toBe('Hello &lt;b&gt;World&lt;/b&gt;');
    });
  });

  describe('sanitizeProjectData', () => {
    it('should sanitize project fields', () => {
      const data = {
        title: '<script>Test</script>',
        description: 'A <b>bold</b> project',
        technologies: ['<script>React</script>', 'TypeScript'],
      };

      const sanitized = sanitizeProjectData(data);
      expect(sanitized.title).toBe('&lt;script&gt;Test&lt;/script&gt;');
      expect(sanitized.description).toBe('A &lt;b&gt;bold&lt;/b&gt; project');
      expect(sanitized.technologies).toEqual([
        '&lt;script&gt;React&lt;/script&gt;',
        'TypeScript',
      ]);
    });
  });
});
