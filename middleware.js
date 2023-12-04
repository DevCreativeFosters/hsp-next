import { NextResponse } from 'next/server';
import routes from '@lib/routes';

const COOKIE_SAVED_VEHICLE = 'hsp-my-vehicle';

function getPathSegments(url) {
  const path = new URL(url).pathname;
  return path?.split('/').filter(Boolean);
}

export function middleware(request) {
  const url = request.nextUrl.clone();
  const pathSegments = getPathSegments(url);
  const hspMyVehicle = request.cookies.get(COOKIE_SAVED_VEHICLE);

  if (pathSegments[0] === 'products' && pathSegments.length === 2) {
    const referer = request.headers.get('referer');
    const refererPathSegments = referer ? getPathSegments(referer) : [];

    if (
      refererPathSegments.length > 2 &&
      refererPathSegments[1] === pathSegments[1]
    ) {
      return NextResponse.next();
    }

    if (hspMyVehicle) {
      const { maker, model } = JSON.parse(hspMyVehicle.value);
      const productType = pathSegments[1];
      if (maker && model) {
        url.pathname = routes.product(productType, maker.slug, model.slug);
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
