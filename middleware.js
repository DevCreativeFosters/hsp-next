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
  matcher: ['/products/:path*'],
};
