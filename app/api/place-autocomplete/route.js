import { NextResponse } from 'next/server';

const { GOOGLE_MAPS_API_KEY } = process.env;

export async function GET(request) {
  const query = request.nextUrl.searchParams.get('q');
  const sessionToken = request.nextUrl.searchParams.get('sessiontoken');

  const params = [
    `input=${query}`,
    'components=country:au',
    sessionToken ? `sessiontoken=${sessionToken}` : null,
    `key=${GOOGLE_MAPS_API_KEY}`,
  ]
    .filter(Boolean)
    .join('&');
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ message: `Error: ${error}` }, { status: 500 });
  }
}
