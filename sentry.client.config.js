// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  dsn: 'https://2e9ff5c22739fc0f169966eaa19a39fa@o66342.ingest.us.sentry.io/4508001145913344',
  enabled:
    process.env.VERCEL_ENV === 'production' ||
    process.env.VERCEL_ENV === 'preview',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0,
});
