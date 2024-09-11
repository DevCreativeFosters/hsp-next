const path = require('path');
const globImporter = require('node-sass-glob-importer');

if (!process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
  throw new Error(`
    Please provide a valid WordPress instance URL.
    Add to your environment variables NEXT_PUBLIC_WORDPRESS_API_URL.
  `);
}

const wpImageDomain = process.env.NEXT_PUBLIC_WORDPRESS_API_URL.match(
  /(?!(w+)\.)\w*(?:\w+\.)+\w+/,
)[0];

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    // reduce number of workers when
    // building static pages
    cpus: 1,
  },
  images: {
    remotePatterns: [
      {
        hostname: wpImageDomain,
        protocol: 'http',
      },
      {
        hostname: wpImageDomain,
        protocol: 'https',
      },
      {
        hostname: '**.gravatar.com',
        protocol: 'https',
      },
      {
        hostname: '**.cdninstagram.com',
        protocol: 'https',
      },
      {
        hostname: 'hsp-wp.x5view.co',
        protocol: 'https',
      },
      {
        hostname: 'hsp-wp.test',
        protocol: 'http',
      },
      {
        hostname: '**.wpenginepowered.com',
        protocol: 'http',
      },
      {
        hostname: '**.wpenginepowered.com',
        protocol: 'https',
      },
    ],
  },
  sassOptions: {
    importer: globImporter(),
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "_common.scss";`,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
