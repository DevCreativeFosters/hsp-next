import { NextResponse } from 'next/server';
import constants from '@lib/constants';

const COOKIE_SAVED_VEHICLE = constants.LOCAL_STORAGE_VEHICLE;

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

      if (maker && maker.value) {
        const productType = pathSegments[1];
        url.pathname =
          model && model.value
            ? `/products/${productType}/${maker.value}/${model.value}`
            : `/products/${productType}/${maker.value}`;

        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/products/:path*'],
};
