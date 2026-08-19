/**
 * JSON-LD Structured Data Components
 * Requirement 8.9 - SEO: JSON-LD para Person, WebSite, CreativeWork
 * 
 * Estos componentes agregan datos estructurados para mejorar el SEO
 * y la aparición en resultados de búsqueda enriquecidos
 */

export function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Julián Estiven Gutiérrez Tabares',
    alternateName: 'Julián Gutiérrez',
    jobTitle: 'Tecnólogo en Desarrollo de Software',
    description: 'Full-Stack Developer especializado en React, Next.js, Node.js, Python y Django',
    url: 'https://tu-dominio.com',
    image: 'https://tu-dominio.com/images/profile.jpg',
    sameAs: [
      'https://github.com/Karatsuyu',
      'https://www.linkedin.com/in/julian-estiven-gutierrez-tabares-04119a382/',
      'https://x.com/JulinTabar7259',
      'https://www.instagram.com/tabjulian07/',
    ],
    email: 'mailto:julian.estiven.gutierrez@correounivalle.edu.co',
    telephone: '+573234378971',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'El Vergel, Génova',
      addressRegion: 'Quindío',
      addressCountry: 'CO',
    },
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Python',
      'Django',
      'FastAPI',
      'PostgreSQL',
      'Docker',
      'Git',
      'Full-Stack Development',
      'Web Development',
      'Frontend Development',
      'Backend Development',
    ],
    knowsLanguage: [
      {
        '@type': 'Language',
        name: 'Spanish',
        alternateName: 'es',
      },
      {
        '@type': 'Language',
        name: 'English',
        alternateName: 'en',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Julián Gutiérrez - Portfolio',
    alternateName: [
      'Julián Estiven Gutiérrez Portfolio',
      'Julián Gutiérrez Developer Portfolio',
    ],
    url: 'https://tu-dominio.com',
    description:
      'Portafolio profesional de Julián Estiven Gutiérrez - Tecnólogo en Desarrollo de Software | Professional portfolio of Julián Estiven Gutiérrez - Software Development Technologist',
    inLanguage: ['es-CO', 'en-US'],
    author: {
      '@type': 'Person',
      name: 'Julián Estiven Gutiérrez Tabares',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://tu-dominio.com?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ProfilePageJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Julián Estiven Gutiérrez Tabares',
      alternateName: 'Julián Gutiérrez',
      jobTitle: 'Tecnólogo en Desarrollo de Software',
      description: 'Full-Stack Developer with expertise in React, Next.js, Node.js, Python, and Django',
      image: 'https://tu-dominio.com/images/profile.jpg',
      url: 'https://tu-dominio.com',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://tu-dominio.com',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function PortfolioProjectJsonLd({
  name,
  description,
  url,
  image,
  technologies,
  dateCreated,
}: {
  name: string;
  description: string;
  url?: string;
  image?: string;
  technologies: string[];
  dateCreated?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': url || `https://tu-dominio.com/project/${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    description,
    url,
    image,
    creator: {
      '@type': 'Person',
      name: 'Julián Estiven Gutiérrez Tabares',
    },
    keywords: technologies.join(', '),
    dateCreated: dateCreated || new Date().toISOString(),
    inLanguage: ['es', 'en'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
