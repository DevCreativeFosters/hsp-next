import { resolvePreview } from '@lib/api/get-post-type-preview';
import { fetchAPI } from '@lib/fetch-api';

export async function getBlogPost(slug, preview = false) {
  const [asPreview, id] = await resolvePreview(slug, preview, 'post');

  const query = `
    query PostBySlug($id: ID!, $idType: PostIdType!, $asPreview: Boolean!) {
      post(id: $id, idType: $idType, asPreview: $asPreview) {
        content
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
        excerpt
        title
        uri
      }
    }
  `;

  const data = await fetchAPI(
    query,
    {
      variables: {
        asPreview,
        id: asPreview ? id : slug,
        idType: asPreview ? 'DATABASE_ID' : 'SLUG',
      },
    },
    asPreview,
  );

  return data?.post;
}
