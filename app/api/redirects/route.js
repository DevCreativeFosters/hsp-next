import { NextResponse } from 'next/server';

function getRedirectsUrl() {
  const apiUrl = new URL(process.env.NEXT_PUBLIC_WORDPRESS_API_URL);
  apiUrl.pathname = '/wp-content/uploads/redirects.json';
  apiUrl.search = `v=${Date.now()}`;
  return apiUrl.toString();
}

export async function GET() {
  const res = await fetch(getRedirectsUrl(), {
    next: { tags: ['redirects'] },
  });
  if (!res.ok) {
    if (res.status === 404) {
      return NextResponse.json([]);
    }

    return NextResponse.json(
      { error: `Failed to fetch redirects: ${res.status} ${res.statusText}` },
      { status: 500 },
    );
  }
  const json = await res.json();
  return NextResponse.json(json);
}
