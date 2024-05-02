import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

import { getPostTypePreview } from '@lib/api/get-post-type-preview';
import routes from '@lib/routes';

export async function GET(request) {
  // Parse query string parameters
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const id = searchParams.get('id'); // always use ID to find the preview version - simplifies the logic
  const postType = searchParams.get('post_type') || 'post';
  let routeBase = '';

  switch (postType) {
    case 'post':
      routeBase = routes.blog();
      break;
    case 'hsp_tv':
      routeBase = routes.tv();
      break;
    default:
      routeBase = '/';
      break;
  }

  // Check the secret and next parameters
  // This secret should only be known by this API route
  if (
    !process.env.WORDPRESS_PREVIEW_SECRET ||
    secret !== process.env.WORDPRESS_PREVIEW_SECRET ||
    !id
  ) {
    return new Response('Invalid token', { status: 401 });
  }

  // Fetch WordPress to check if the provided `id` exists
  const post = await getPostTypePreview(id, postType);

  // If the post doesn't exist prevent preview mode from being enabled
  if (!post) {
    return new Response(`No preview for given ID: ${id}`, { status: 401 });
  }

  // Enable Draft Mode by setting the cookie
  draftMode().enable();

  // Redirect to the path from the fetched post.
  // We don't redirect to searchParams.id as that might lead to open redirect vulnerabilities.
  // Also, preview mode works best when using IDs, since draft/autosave slugs differ from published ones.
  // The only exception is pages, where we enter preview mode but force the latest revision
  // (and only on pages that support it).
  if (postType === 'page') {
    redirect(`/${post.revisionOf?.node?.slug || post.slug}/`);
  } else {
    redirect(`${routeBase}/${post.databaseId}/`);
  }
}
