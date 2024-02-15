const path = require('path');
const globImporter = require('node-sass-glob-importer');

if (!process.env.NEXT_PUBLIC_WORDPRESS_API_URL) {
  throw new Error(`
    Please provide a valid WordPress instance URL.
    Add to your environment variables NEXT_PUBLIC_WORDPRESS_API_URL.
  `);
}

/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: [
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL.match(
        /(?!(w+)\.)\w*(?:\w+\.)+\w+/,
      )[0], // Valid WP Image domain.
      '0.gravatar.com',
      '1.gravatar.com',
      '2.gravatar.com',
      'secure.gravatar.com',
      'hsp-wp.x5view.co',
      'hsp-wp.test',
      'prodhsp.wpenginepowered.com',
      'stghsp.wpenginepowered.com',
      'devhsp.wpenginepowered.com',
      'scontent.cdninstagram.com',
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "_common.scss";`,
    importer: globImporter(),
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
