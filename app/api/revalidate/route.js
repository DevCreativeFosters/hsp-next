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

export async function POST(request) {
  const body = await request.json();

  if (body.secret !== process.env.WORDPRESS_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const tags = body.tags;

  if (!tags || !Array.isArray(tags)) {
    return NextResponse.json(
      { message: 'No tags provided or invalid format' },
      { status: 400 },
    );
  }

  try {
    tags.forEach(tag => revalidateTag(tag));

    return NextResponse.json({
      message: 'Revalidation successful',
      revalidated: true,
      tags,
    });
  } catch (error) {
    console.error('Error during revalidation:', error);
    return NextResponse.json(
      { message: `Error revalidating: ${error.message}` },
      { status: 500 },
    );
  }
}
