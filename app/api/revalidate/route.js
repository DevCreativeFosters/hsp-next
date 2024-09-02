import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request) {
  if (
    request.nextUrl.searchParams.get('secret') !==
    process.env.WORDPRESS_REVALIDATE_SECRET
  ) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get('path') || '/';
  const tags = request.nextUrl.searchParams.get('tags');

  try {
    if (tags) {
      tags.split('|').forEach(tag => revalidateTag(tag));
    } else {
      revalidatePath(path);
    }

    return NextResponse.json({ now: Date.now(), revalidated: true });
  } catch (error) {
    return NextResponse.json(
      { message: `Error revalidating ${error}` },
      { status: 500 },
    );
  }
}
