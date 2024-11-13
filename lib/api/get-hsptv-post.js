import { resolvePreview } from '@lib/api/get-post-type-preview';
import { fetchAPI } from '@lib/fetch-api';

export async function getHspTvPost(slug, preview) {
  const [asPreview, id] = await resolvePreview(slug, preview, 'post');

  const query = `
    query HspTvPost($id: ID!, $idType: HspTvPostIdType!, $asPreview: Boolean!) {
      hspTvPost(id: $id, idType: $idType, asPreview: $asPreview) {
        title
        content
        hspTvPostCustomFields {
          description
          videoId
          backgroundVideo {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(
    query,
    {
      tags: [`hsp-tv:${slug}`],
      variables: {
        asPreview,
        id: asPreview ? id : slug,
        idType: asPreview ? 'DATABASE_ID' : 'SLUG',
      },
    },
    asPreview,
  );

  return data?.hspTvPost;
}
