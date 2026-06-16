import { WORDPRESS_API_URL } from '@lib/config';

// Same-origin proxy for browser GraphQL calls. Forwards to WordPress and
// handles WooCommerce session continuity two ways:
//
// 1. Rewrites WP's Set-Cookie so the browser scopes the WC session cookie to
//    OUR origin rather than the Cloudways one — otherwise cross-site cookie
//    rules drop it in incognito/Safari/Firefox-strict and the WC session
//    dies between requests.
//
// 2. Threads the WooGraphQL `woocommerce-session` JWT through. WooGraphQL's
//    QL_Session_Handler issues a JWT in the `woocommerce-session` RESPONSE
//    header on every cart-touching GraphQL call, and PREFERS that header
//    over the cookie on GraphQL requests (Issue #285). Without echoing it
//    back, every request lands in a fresh empty session and the cart
//    vanishes between addToCart and checkoutOrder. We persist the JWT into
//    a first-party `wc_session_jwt` cookie and inject it as the
//    `woocommerce-session` request header on the next call.
function rewriteCookieForSameOrigin(cookie) {
  return cookie
    .replace(/;\s*Domain=[^;]+/gi, '')
    .replace(/;\s*Secure/gi, '')
    .replace(/;\s*SameSite=None/gi, '; SameSite=Lax');
}

function readWcSessionJwtFromCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)wc_session_jwt=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(request) {
  const body = await request.text();
  const authHeader = request.headers.get('authorization');
  const cookie = request.headers.get('cookie');
  const wcSessionJwt = readWcSessionJwtFromCookie(cookie);

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
      ...(wcSessionJwt && {
        'woocommerce-session': `Session ${wcSessionJwt}`,
      }),
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

  // Capture WooGraphQL's session JWT from the response and persist it as a
  // first-party HttpOnly cookie. Next request will read it back and echo it
  // as `woocommerce-session: Session <jwt>` to keep WC's session sticky.
  const wcSessionResponse = res.headers.get('woocommerce-session');
  if (wcSessionResponse) {
    const token = wcSessionResponse.replace(/^Session\s+/i, '');
    responseHeaders.append(
      'Set-Cookie',
      `wc_session_jwt=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=172800`,
    );
  }

  return new Response(text, {
    headers: responseHeaders,
    status: res.status,
  });
}
