const path = require('path');
const globImporter = require('node-sass-glob-importer');
const redirects = require('./lib/redirects');

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
  async redirects() {
    return redirects.map(({ destination, permanent, source }) => ({
      destination,
      permanent: permanent ?? true,
      source,
    }));
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

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(module.exports, {
  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
  org: 'xfive',

  project: 'hsp4x4',

  sentryUrl: 'https://sentry.io/',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
});
