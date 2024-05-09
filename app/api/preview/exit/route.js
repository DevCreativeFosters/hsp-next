import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request) {
  draftMode().disable();

  const { origin, searchParams } = new URL(request.url);
  const redirectUrl = `${origin}${searchParams.get('redirect') || '/'}`;

  redirect(redirectUrl);
}
