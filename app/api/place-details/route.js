import { NextResponse } from 'next/server';

export async function GET(request) {
  const placeId = request.nextUrl.searchParams.get('place_id');
  const sessionToken = request.nextUrl.searchParams.get('sessiontoken');
  const params = [
    `place_id=${placeId}`,
    sessionToken ? `sessiontoken=${sessionToken}` : null,
    `key=${process.env.GOOGLE_PLACES_API_KEY}`,
  ]
    .filter(Boolean)
    .join('&');
  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error}` }, { status: 500 });
  }
}
