import * as Sentry from '@sentry/nextjs';

import { getSitemap } from '@lib/api/get-sitemap';

export async function GET() {
  try {
    const sitemap = await getSitemap();

    if (!sitemap) {
      console.error('No sitemap data received');
      throw new Error('No sitemap data received from WordPress');
    }

    if (!sitemap) {
      console.error('No sitemap content found in WordPress ACF field');
      throw new Error('No sitemap content found');
    }

    // Validate if the content looks like XML
    if (
      !sitemap.trim().startsWith('<?xml') &&
      !sitemap.trim().startsWith('<urlset')
    ) {
      console.error(
        'Invalid sitemap format:',
        sitemap.substring(0, 100) + '...',
      );
      throw new Error('Invalid sitemap content');
    }

    return new Response(sitemap, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    Sentry.captureException(error, {
      tags: {
        component: 'sitemap',
        endpoint: '/sitemap.xml',
      },
    });

    const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || '';

    // Fallback, basic sitemap
    const staticRoutes = [
      '',
      'australian-made',
      'contact-us',
      'lifestyle',
      'lifestyle/hsp-blog',
      'lifestyle/hsp-celebrities',
      'lifestyle/hsp-tv',
      'products',
      'store-locator',
      'support',
      'ute-builder',
    ];

    const sitemapEntries = staticRoutes
      .map(route => {
        const url = route === '' ? baseUrl : `${baseUrl}/${route}`;
        return `  <url>
    <loc>${url}</loc>
  </url>`;
      })
      .join('\n');

    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;

    return new Response(fallbackSitemap, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'application/xml',
      },
    });
  }
}
