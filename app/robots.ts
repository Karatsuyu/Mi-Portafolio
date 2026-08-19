import { MetadataRoute } from 'next';

/**
 * Genera robots.txt dinámicamente
 * Requirement 8.8 - SEO: robots.txt con rutas permitidas y excluidas
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://tu-dominio.com'; // TODO: Reemplazar con tu dominio real

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // Excluir endpoints de API
          '/_next/',         // Excluir archivos internos de Next.js
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
