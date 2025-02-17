export const revalidate = 0;

export default async function robots() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/robots.txt`,
    {
      cache: 'no-store',
    },
  );

  const text = await res.text();

  const lines = text.split('\n');

  const userAgents = lines
    .filter(line => line.startsWith('User-agent: '))
    .map(line => line.replace('User-agent: ', ''));
  const allows = lines
    .filter(line => line.startsWith('Allow: '))
    .map(line => line.replace('Allow: ', ''));
  const disallows = lines
    .filter(line => line.startsWith('Disallow: '))
    .map(line => line.replace('Disallow: ', ''));
  const sitemaps = lines
    .filter(line => line.startsWith('Sitemap: '))
    .map(line => line.replace('Sitemap: ', ''));

  const robots = {
    rules: userAgents.map(userAgent => ({
      allow: allows,
      disallow: disallows,
      userAgent,
    })),
    sitemap: sitemaps[0],
  };

  return robots;
}
