import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request) {
  if (
    request.nextUrl.searchParams.get('secret') !==
    process.env.WORDPRESS_REVALIDATE_SECRET
  ) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get('path') || '/';

  try {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json(
      { message: `Error revalidating ${error}` },
      { status: 500 },
    );
  }
}
