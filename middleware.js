import routes from '@lib/routes';
import { NextResponse } from 'next/server';
import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';
import { getValueOrSlug } from '@lib/helpers';

const COOKIE_SAVED_VEHICLE = LOCAL_STORAGE_VEHICLE;

function getPathSegments(url) {
  const path = new URL(url).pathname;
  return path?.split('/').filter(Boolean);
}

export function middleware(request) {
  const url = request.nextUrl.clone();
  const pathSegments = getPathSegments(url);
  const hspMyVehicle = request.cookies.get(COOKIE_SAVED_VEHICLE);

  const routesWithPagination = [routes.blog(), routes.tv()];
  const paginatedUrl = routesWithPagination
    .map(route => {
      const routeSegments = route.slice(1).split('/');
      if (pathSegments.join().includes(routeSegments.join())) {
        if (pathSegments.length === routeSegments.length + 1) {
          const lastSegment = pathSegments.slice(-1)[0];
          const isPagination = lastSegment.startsWith('page-');
          if (isPagination) {
            const pageNumber = lastSegment.split('page-')[1];
            const searchParams = new URLSearchParams({ page: pageNumber });
            return [`${url.origin}${route}`, searchParams.toString()]
              .filter(Boolean)
              .join('?');
          }
        }
      }
    })
    .filter(Boolean)[0];

  if (paginatedUrl) {
    return NextResponse.rewrite(paginatedUrl);
  }

  if (pathSegments[0] === 'products' && pathSegments.length === 2) {
    if (hspMyVehicle) {
      const { maker, model } = JSON.parse(hspMyVehicle.value);

      if (maker && getValueOrSlug(maker)) {
        const productType = pathSegments[1];
        url.pathname =
          model && getValueOrSlug(model)
            ? `/products/${productType}/${getValueOrSlug(
                maker,
              )}/${getValueOrSlug(model)}`
            : `/products/${productType}/${getValueOrSlug(maker)}`;

        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/products/:path*',
    '/lifestyle/hsp-blog/:path*', // this must match with routes.blog()
    '/lifestyle/hsp-tv/:path*', // this must match with routes.tv()
  ],
};
