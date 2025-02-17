import { NextResponse } from 'next/server';

import { redirectsMiddleware } from '@lib/middleware-redirects';
import routes from '@lib/routes';

function getPathSegments(url) {
  return url.pathname.split('/').filter(Boolean);
}

function paginationMiddleware(request) {
  const routesWithPagination = [routes.blog(), routes.tv()];
  const url = request.nextUrl;

  const pathSegments = getPathSegments(url);
  const paginatedUrl = routesWithPagination
    .map(route => {
      const routeSegments = route.slice(1).split('/');
      if (
        pathSegments.join().startsWith(routeSegments.join()) &&
        pathSegments.length === routeSegments.length + 1
      ) {
        const lastSegment = pathSegments.slice(-1)[0];
        const isPagination = lastSegment.startsWith('page-');

        if (isPagination) {
          const pageNumber = lastSegment.split('page-')[1];
          const searchParams = new URLSearchParams({ page: pageNumber });
          return [`${url.origin}${route}`, searchParams.toString()].join('?');
        }
      }
    })
    .filter(Boolean)[0];

  if (paginatedUrl) {
    return NextResponse.rewrite(paginatedUrl);
  }
}

/**
 * @param {import('next/server').NextRequest} request
 * @returns {import('next/server').NextResponse}
 */
export async function middleware(request) {
  const redirectsResponse = await redirectsMiddleware(request);

  if (redirectsResponse) {
    return redirectsResponse;
  }

  const paginationResponse = paginationMiddleware(request);

  if (paginationResponse) {
    return paginationResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
