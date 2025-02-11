import { headers } from 'next/headers';

import { getGlobalOptions } from '@lib/api/get-global-options';

export async function GET() {
  try {
    const data = await getGlobalOptions();

    if (!data) {
      console.error('No data received from getGlobalOptions');
      throw new Error('No data received from WordPress');
    }

    const sitemap = data?.sitemap;

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

    const headersList = headers();
    return new Response(sitemap, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);

    const baseUrl = new URL(process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '')
      .origin;

    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackSitemap, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'application/xml',
      },
    });
  }
}
