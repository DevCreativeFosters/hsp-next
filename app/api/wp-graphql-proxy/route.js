import { WORDPRESS_API_URL } from '@lib/config';

// Same-origin proxy for browser GraphQL calls. Forwards to WordPress, relays
// the WC session cookie both ways (rewriting Set-Cookie so the browser scopes
// it to OUR origin rather than the Cloudways one — otherwise cross-site
// cookie rules drop it in incognito/Safari/Firefox-strict and the WC session
// dies between requests, which kills addToCart→checkoutOrder flow). Also
// logs cart ops so we can see what each request returned.
function rewriteCookieForSameOrigin(cookie) {
  return cookie
    .replace(/;\s*Domain=[^;]+/gi, '')
    .replace(/;\s*Secure/gi, '')
    .replace(/;\s*SameSite=None/gi, '; SameSite=Lax');
}

export async function POST(request) {
  const body = await request.text();
  const authHeader = request.headers.get('authorization');
  const cookie = request.headers.get('cookie');

  const op = body.includes('createDealerQuote')
    ? 'createDealerQuote'
    : body.includes('getCartItems')
      ? 'getCartItems'
      : body.includes('addToCart')
        ? 'addToCart'
        : body.includes('getWishlist')
          ? 'getWishlist'
          : '';

  // Decode the role claim from the JWT so we can see what the browser sends.
  let tokenRole = 'none';
  if (authHeader) {
    try {
      const payload = authHeader.replace(/^Bearer\s+/i, '').split('.')[1];
      const json = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
      tokenRole = json?.data?.user?.role ?? 'unknown';
    } catch {
      tokenRole = 'decode-error';
    }
  }

  const res = await fetch(WORDPRESS_API_URL, {
    body,
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader && { Authorization: authHeader }),
      ...(cookie && { Cookie: cookie }),
    },
    method: 'POST',
    redirect: 'manual',
  });

  const text = await res.text();

  if (op) {
    let detail = '';
    try {
      const j = JSON.parse(text);
      const node =
        j?.data?.getCartItems ||
        j?.data?.addToCart ||
        j?.data?.createDealerQuote ||
        {};
      detail =
        op === 'createDealerQuote'
          ? `msg="${node.message}"`
          : `cartCount=${node.cartCount}`;
    } catch {}
    // eslint-disable-next-line no-console
    console.log(
      `[CARTLOG] op=${op} auth=${!!authHeader} tokenRole=${tokenRole} ${detail}`,
    );
  }

  const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
  const setCookies =
    typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : [];
  for (const c of setCookies) {
    responseHeaders.append('Set-Cookie', rewriteCookieForSameOrigin(c));
  }

  return new Response(text, {
    headers: responseHeaders,
    status: res.status,
  });
}
