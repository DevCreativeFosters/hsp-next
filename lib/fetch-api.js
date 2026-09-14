import { WORDPRESS_API_URL } from '@lib/config';

// Browser and server both talk to WordPress directly. The same-origin proxy
// at /api/wp-graphql-proxy was removed on request (2026-09-14).
//
// KNOWN TRADE-OFF, deliberate: WooCommerce keeps the cart on
// `wp_woocommerce_session_*` / `woocommerce_cart_hash` /
// `woocommerce_items_in_cart`, which WP sets with `SameSite=None; Secure` on
// its own host. While the storefront is on hsputelids.com and WP is on
// cloudwaysapps.com, those are THIRD-PARTY cookies. The proxy used to rewrite
// them onto our origin; without it, any browser that blocks third-party
// cookies drops the cart between requests. Measured on staging WP before this
// change: Safari/WebKit addToCart returned cartCount 1, the next getCartItems
// returned 0; Chromium (3rd-party cookies allowed) kept the cart.
// Also lost: WP sends no Access-Control-Expose-Headers, so scripts cannot read
// WooGraphQL's `woocommerce-session` JWT, and the session cookie is HttpOnly
// so scripts cannot replay it either.
//
// The durable fix is DNS, not code: serve WordPress from a subdomain of the
// storefront domain (e.g. wp.hsputelids.com) so the session cookies are
// first-party again, at which point nothing here needs to change.
const API_URL = WORDPRESS_API_URL;

function getErrorDetails(query, variables) {
  const queryJson = JSON.stringify(query.substring(0, 50));
  const variablesJson = JSON.stringify(variables);
  return `(query: ${queryJson}, variables: ${variablesJson})`;
}

// Build-time safety net. When `next build` is collecting page data, a
// WP flake (Cloudways 500, ACF/WPGraphQL plugin crash) makes EVERY fetch
// from a Server Component a deploy-blocker. We've already lost multiple
// deploys to this. The right runtime behaviour is still "throw and let
// the caller decide", but during a production build we'd rather ship a
// page rendered with `null` data than fail the deploy. Runtime requests
// (every user-driven mutation: login, addToCart, checkout, etc.) are
// unaffected because they never hit this branch — NEXT_PHASE is only
// set during the build phase.
const IS_BUILD = process.env.NEXT_PHASE === 'phase-production-build';

async function fetchAPIInternal(
  query = '',
  {
    authToken = null,
    keepRevalidate = false,
    revalidate = 600,
    tags,
    variables,
  } = {},
  isPreview = false,
  debug = false,
) {
  if (!API_URL) {
    throw new Error('API_URL is not defined');
  }

  let requestInit;

  if (isPreview && process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    requestInit = {
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: 'no-store',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
  } else {
    requestInit = {
      body: JSON.stringify({
        query,
        variables,
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      method: 'POST',
      next: {
        ...(tags && { revalidate: 24 * 60 * 60, tags }),
        ...((!tags || tags.length === 0 || keepRevalidate) && { revalidate }),
      },
    };
  }

  let startTime;

  if (typeof window === 'undefined' && process.env.FETCH_API_LOGGING) {
    startTime = process.hrtime.bigint();
  }

  const res = await fetch(API_URL, requestInit);

  // you can also use NEXT_PRIVATE_DEBUG_CACHE=1 together
  if (typeof window === 'undefined' && process.env.FETCH_API_LOGGING) {
    const diff = process.hrtime.bigint() - startTime;
    const diffMs = Number(diff / 1_000_000n);
    console.log(
      'FETCH',
      diffMs,
      JSON.stringify(query.substring(0, 50)),
      JSON.stringify(variables),
      JSON.stringify(tags),
    );
  }

  if (!res.ok) {
    const errorDetails = getErrorDetails(query, variables);
    throw new Error(
      `Failed to fetch API: ${res.status} - ${res.statusText} ${errorDetails}`,
    );
  }

  // Read as text (not res.json()) so a parse failure still leaves us
  // the raw body for the salvage pass below.
  let rawText;
  try {
    rawText = await res.text();
  } catch (err) {
    const errorDetails = getErrorDetails(query, variables);
    throw new Error(
      `Failed to parse JSON response: ${err.message} ${errorDetails}`,
    );
  }

  let json;

  try {
    json = JSON.parse(rawText);
  } catch (err) {
    // Salvage pass: WP sometimes emits HTML noise BEFORE the JSON body
    // while still sending Content-Type: application/json — e.g. the
    // wpdberror block from the broken wp_dealer_quotes ALTER TABLE
    // migration (July 2026) prepended ~4KB of <div id="error"> markup
    // to every response and took down cart/categories/forms parsing
    // site-wide. The JSON itself is intact after the garbage, so find
    // where it starts and parse from there instead of failing the
    // whole request. Real HTML error pages (404s, WAF blocks) have no
    // '{"' at all and still throw below.
    const jsonStart = rawText.indexOf('{"');
    if (jsonStart > 0) {
      try {
        json = JSON.parse(rawText.slice(jsonStart));
        console.warn(
          `[fetchAPI] Salvaged JSON after ${jsonStart} bytes of non-JSON prefix (WP emitted HTML before the GraphQL body)`,
        );
      } catch {
        /* fall through to the original error */
      }
    }
    if (!json) {
      const errorDetails = getErrorDetails(query, variables);
      throw new Error(
        `Failed to parse JSON response: ${err.message} ${errorDetails}`,
      );
    }
  }

  if (json?.errors?.length) {
    // WP can answer 200 with usable data AND a partial error. Two kinds are
    // survivable, everything else still throws:
    //
    //  - uploadImage mutation errors (long-standing carve-out).
    //  - A single unrenderable row inside an ACF flexible-content list. WP
    //    nulls that one row and reports an error whose path ends
    //    ... 'flexibleContent', 'blocks', <index>; every other row comes back
    //    intact. Treating it as fatal throws a whole page away over one row —
    //    which is what took down the BYD Shark product and accessories page on
    //    testing (2026-09-14), where a stored row names a layout that no longer
    //    exists in the field group. renderBlock already null-guards every field
    //    it touches, so the bad row renders as nothing and the page survives.
    //
    // Deliberately narrow: the path must have a numeric index directly under a
    // `blocks` list that is itself directly under `flexibleContent`. A failure
    // of the `blocks` field itself, or of anything else in the response, has no
    // such path and is still fatal.
    const isFlexibleContentRowError = error => {
      const path = error?.path;
      if (!Array.isArray(path)) return false;
      const blocksIndex = path.lastIndexOf('blocks');
      return (
        blocksIndex > 0 &&
        path[blocksIndex - 1] === 'flexibleContent' &&
        typeof path[blocksIndex + 1] === 'number'
      );
    };
    const isUploadImageError = error =>
      Array.isArray(error?.path) && error.path.some(p => p === 'uploadImage');

    const fatalErrors = json.errors.filter(
      error => !isUploadImageError(error) && !isFlexibleContentRowError(error),
    );

    // Only swallow when WP actually handed us data to render. A null `data`
    // alongside a tolerated error means nothing survived, and a blank page is
    // worse than a loud failure.
    if (fatalErrors.length || !json?.data) {
      if (debug) {
        console.debug('query', query);
        console.error('json.errors', json.errors);
      }
      const errors = (fatalErrors.length ? fatalErrors : json.errors)
        .map(e => e.message)
        .join(', ');
      const errorDetails = getErrorDetails(query, variables);
      throw new Error(`API returned errors: ${errors} ${errorDetails}`);
    }

    const skipped = json.errors.filter(isFlexibleContentRowError);
    if (skipped.length) {
      console.warn(
        `[fetchAPI] Skipped ${skipped.length} unreadable flexible-content row(s) and rendered the rest: ` +
          `${skipped.map(e => e.path.join('.')).join('; ')} — a stored row references a layout that no longer ` +
          `exists in the ACF field group; fix it in WordPress ${getErrorDetails(query, variables)}`,
      );
    }
  }

  return json?.data;
}

export async function fetchAPI(...args) {
  if (!IS_BUILD) return fetchAPIInternal(...args);
  try {
    return await fetchAPIInternal(...args);
  } catch (err) {
    console.error(
      '[build-time] fetchAPI swallowed error — returning null:',
      err?.message,
    );
    return null;
  }
}
