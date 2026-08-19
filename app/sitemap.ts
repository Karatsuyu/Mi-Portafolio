import { MetadataRoute } from 'next';

/**
 * Genera el sitemap dinámicamente para todas las rutas públicas del portafolio
 * Requirement 8.7 - SEO: Sitemap con rutas indexables
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tu-dominio.com'; // TODO: Reemplazar con tu dominio real
  const lastModified = new Date();

  // Rutas principales del portafolio
  const routes = [
    '',
    '/classic',
    '/classic/formacion',
    '/classic/proyectos',
    '/classic/experiencia',
    '/classic/habilidades',
    '/classic/certificados',
    '/classic/contacto',
    '/runic',
    '/cyber',
    '/cyber/formacion',
    '/cyber/proyectos',
    '/cyber/experiencia',
    '/cyber/habilidades',
    '/cyber/certificados',
    '/cyber/contacto',
    '/space',
    '/themes',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
