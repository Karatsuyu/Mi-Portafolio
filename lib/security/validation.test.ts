import { describe, it, expect } from 'vitest';
import { projectSchema, contactFormSchema, visitSchema } from './validation';

describe('projectSchema', () => {
  it('should validate and escape HTML in title and description', () => {
    const input = {
      title: '<script>alert("xss")</script>My Project',
      description: 'A project with <b>bold</b> text & ampersands',
      technologies: ['React', 'TypeScript', '<script>evil</script>'],
      github_url: 'https://github.com/user/repo',
      live_url: 'https://example.com',
      image_url: 'https://example.com/image.png',
    };

    const result = projectSchema.safeParse(input);
    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data.title).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;My Project');
      expect(result.data.description).toBe('A project with &lt;b&gt;bold&lt;/b&gt; text &amp; ampersands');
      expect(result.data.technologies).toContain('&lt;script&gt;evil&lt;/script&gt;');
      expect(result.data.github_url).toBe('https://github.com/user/repo');
    }
  });

  it('should require title and description', () => {
    const input = {
      technologies: ['React'],
    };

    const result = projectSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should validate URL formats', () => {
    const input = {
      title: 'Test Project',
      description: 'Test Description',
      technologies: ['React'],
      github_url: 'invalid-url',
    };

    const result = projectSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should validate technologies array contains only strings', () => {
    const input = {
      title: 'Test Project',
      description: 'Test Description',
      technologies: ['React', 123 as any, 'TypeScript'],
    };

    const result = projectSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should normalize whitespace in title and description', () => {
    const input = {
      title: '  Multiple   spaces   here  ',
      description: '  Lots    of    spaces  ',
      technologies: ['React'],
    };

    const result = projectSchema.safeParse(input);
    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data.title).toBe('Multiple spaces here');
      expect(result.data.description).toBe('Lots of spaces');
    }
  });

  it('should allow optional URL fields to be empty strings', () => {
    const input = {
      title: 'Test Project',
      description: 'Test Description',
      technologies: ['React'],
      github_url: '',
      live_url: '',
      image_url: '',
    };

    const result = projectSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});

describe('contactFormSchema', () => {
  it('should validate and escape HTML in contact fields', () => {
    const input = {
      name: '<script>alert("xss")</script>John Doe',
      email: 'john@example.com',
      message: 'This is a message with <b>HTML</b> tags & special chars',
    };

    const result = contactFormSchema.safeParse(input);
    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data.name).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;John Doe');
      expect(result.data.email).toBe('john@example.com');
      expect(result.data.message).toContain('&lt;b&gt;HTML&lt;/b&gt;');
      expect(result.data.message).toContain('&amp;');
    }
  });

  it('should validate name length requirements', () => {
    const shortName = {
      name: 'A',
      email: 'test@example.com',
      message: 'This is a valid message',
    };

    const result = contactFormSchema.safeParse(shortName);
    expect(result.success).toBe(false);
  });

  it('should validate email format', () => {
    const invalidEmail = {
      name: 'John Doe',
      email: 'not-an-email',
      message: 'This is a valid message',
    };

    const result = contactFormSchema.safeParse(invalidEmail);
    expect(result.success).toBe(false);
  });

  it('should validate message length requirements', () => {
    const shortMessage = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Short',
    };

    const result = contactFormSchema.safeParse(shortMessage);
    expect(result.success).toBe(false);
  });
});

describe('visitSchema', () => {
  it('should validate visit with page and user_agent', () => {
    const input = {
      page: '/home',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };

    const result = visitSchema.safeParse(input);
    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data.page).toBe('/home');
      expect(result.data.user_agent).toBe('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    }
  });

  it('should validate visit with only required page field', () => {
    const input = {
      page: '/about',
    };

    const result = visitSchema.safeParse(input);
    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data.page).toBe('/about');
      expect(result.data.user_agent).toBeUndefined();
    }
  });

  it('should require page field', () => {
    const input = {
      user_agent: 'Mozilla/5.0',
    };

    const result = visitSchema.safeParse(input);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Required');
    }
  });

  it('should reject empty page field', () => {
    const input = {
      page: '',
      user_agent: 'Mozilla/5.0',
    };

    const result = visitSchema.safeParse(input);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Page is required');
    }
  });

  it('should trim whitespace from page field', () => {
    const input = {
      page: '  /contact  ',
      user_agent: 'Mozilla/5.0',
    };

    const result = visitSchema.safeParse(input);
    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data.page).toBe('/contact');
    }
  });

  it('should reject page field exceeding max length', () => {
    const input = {
      page: 'a'.repeat(501),
      user_agent: 'Mozilla/5.0',
    };

    const result = visitSchema.safeParse(input);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('Page must be less than 500 characters');
    }
  });

  it('should reject user_agent exceeding max length', () => {
    const input = {
      page: '/home',
      user_agent: 'a'.repeat(1001),
    };

    const result = visitSchema.safeParse(input);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.errors[0].message).toBe('User agent must be less than 1000 characters');
    }
  });
});
