import { NextResponse } from 'next/server';

import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { getValueOrSlug } from '@lib/helpers';
import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';
import routes from '@lib/routes';

const COOKIE_SAVED_VEHICLE = LOCAL_STORAGE_VEHICLE;

function getPathSegments(url) {
  const path = typeof url === 'string' ? url : new URL(url).pathname;
  return path?.split('/').filter(Boolean);
}

export async function middleware(request) {
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
            return [`${url.origin}${route}`, searchParams.toString()].join('?');
          }
        }
      }
    })
    .filter(Boolean)[0];

  if (paginatedUrl) {
    return NextResponse.rewrite(paginatedUrl);
  }

  if (pathSegments.length === 1 && pathSegments[0] !== 'favicon.ico') {
    const categoryData = await getMainProductCategory(pathSegments[0]);

    if (Object.keys(categoryData).length && hspMyVehicle) {
      const { maker, model } = JSON.parse(hspMyVehicle.value);

      if (maker && getValueOrSlug(maker)) {
        const productType = pathSegments[0];
        url.pathname =
          model && getValueOrSlug(model)
            ? `/${productType}/${getValueOrSlug(maker)}/${getValueOrSlug(
                model,
              )}`
            : `/${productType}/${getValueOrSlug(maker)}`;

        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:category*/:make*/:model*/:variant*',
    '/:path*',
    '/lifestyle/hsp-blog/:path*', // this must match with routes.blog()
    '/lifestyle/hsp-tv/:path*', // this must match with routes.tv()
  ],
};
