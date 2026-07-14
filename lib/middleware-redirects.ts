// should be replaced with "after" after update to next 15
import * as Sentry from '@sentry/nextjs';
import { waitUntil } from '@vercel/functions';
import { NextRequest, NextResponse } from 'next/server';

const MINUTES_IN_SECONDS = 60;

// for first 5 minutes we use cached redirects
// for next 5 minutes we refresh the cache in the background
// later we force a refresh
const CACHE_REVALIDATE = 5 * MINUTES_IN_SECONDS;
const CACHE_EXPIRE = 10 * MINUTES_IN_SECONDS;

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`;

// {
//   match_url: '/helloax',
//   action_code: '301',
//   action_data: '/worldaa',
// }
type CacheEntry = {
  match_url: string;
  action_code: string;
  action_data: string;
};

declare global {
  var cache: Promise<CacheEntry[]> | CacheEntry[] | null;
  var cacheRefreshPromise: Promise<CacheEntry[]> | null;
  var cachedTimestamp: number;
}

global.cache = null;
global.cacheRefreshPromise = null;
global.cachedTimestamp = 0;

async function refreshExecute() {
  // console.log('fetching redirects from', BASE_URL);
  const res = await fetch(`${BASE_URL}/api/redirects`, {
    headers: {
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch redirects: ${res.status} ${res.statusText}`,
    );
  }

  const json = await res.text();
  return JSON.parse(json);
}

async function refresh() {
  if (global.cache && global.cacheRefreshPromise) {
    // console.log('skipping refresh: already in progress');
    return global.cache;
  }

  global.cacheRefreshPromise = refreshExecute();

  if (!global.cache) {
    global.cache = global.cacheRefreshPromise;
  }

  return global.cacheRefreshPromise
    .then(
      json => {
        // console.log('refreshed redirects');
        global.cache = json;
        global.cachedTimestamp = Math.floor(Date.now() / 1000);
        return json;
      },
      e => {
        console.error('Error refreshing redirects', e);

        if (global.cache === global.cacheRefreshPromise) {
          global.cache = null;
        }

        throw e;
      },
    )
    .finally(() => {
      global.cacheRefreshPromise = null;
    });
}

function refreshIfNecessary() {
  const now = Math.floor(Date.now() / 1000);
  if (!global.cache || now > global.cachedTimestamp + CACHE_EXPIRE) {
    // console.log(`refreshing redirects: waiting`);
    return refresh();
  }

  if (now > global.cachedTimestamp + CACHE_REVALIDATE) {
    // console.log('refreshing redirects in the background');
    waitUntil(refresh());
  } else {
    // console.log('skipping refresh: not expired yet');
  }

  return global.cache;
}

export async function redirectsMiddleware(request: NextRequest) {
  let cache: CacheEntry[];
  try {
    cache = await refreshIfNecessary();
  } catch (e) {
    Sentry.captureException(e);
    return;
  }

  const pathname = request.nextUrl.pathname.toLowerCase();

  const entry = cache.find(entry => entry.match_url === pathname);

  if (entry) {
    // A malformed redirect entry (empty or non-URL-parseable
    // action_data) was crashing the middleware with
    // `TypeError: Invalid URL` on every request to the matched
    // path — taking down the PDP for those slugs. Wrap the URL
    // construction so a bad entry logs to Sentry and falls
    // through to normal routing instead of 500-ing the page.
    let newUrl: URL;
    try {
      newUrl = new URL(entry.action_data, request.url);
    } catch (e) {
      Sentry.captureException(e, {
        extra: {
          action_code: entry.action_code,
          action_data: entry.action_data,
          match_url: entry.match_url,
        },
      });
      return;
    }
    request.nextUrl.searchParams.forEach((value, key) => {
      newUrl.searchParams.append(key, value);
    });
    return NextResponse.redirect(newUrl, Number(entry.action_code));
  }
}
