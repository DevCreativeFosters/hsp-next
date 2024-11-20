import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

import { getPostTypePreview } from '@lib/api/get-post-type-preview';
import routes from '@lib/routes';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const id = searchParams.get('id'); // always use ID to find the preview version - simplifies the logic
  const category = searchParams.get('category');
  const make = searchParams.get('make');
  const model = searchParams.get('model');
  const postType = searchParams.get('post_type') || 'post';
  let graphQLType = postType;

  let routeBase = '';

  switch (postType) {
    case 'post':
      routeBase = routes.blog();
      break;
    case 'hsp-tv':
      routeBase = routes.tv();
      graphQLType = 'hspTvPost';
      break;
    default:
      routeBase = '';
      break;
  }

  if (
    !process.env.WORDPRESS_PREVIEW_SECRET ||
    secret !== process.env.WORDPRESS_PREVIEW_SECRET ||
    !id
  ) {
    return new Response('Invalid token', { status: 401 });
  }

  const post = await getPostTypePreview(id, graphQLType);

  if (!post) {
    return new Response(`No preview for given ID: ${id}`, { status: 404 });
  }

  draftMode().enable();

  if (postType === 'product') {
    const modelPreview = `${model}:${post.databaseId}`;
    redirect(`${routes.product(category, make, modelPreview)}/`);
  } else {
    redirect(`${routeBase}/${post.databaseId}/`);
  }
}
