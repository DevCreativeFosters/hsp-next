import { fetchAPI } from '@lib/fetch-api';

export async function getHspTvPost(slug) {
  const query = /* GraphQL */ `
    query hspTvPost($slug: String!) {
      hspTvPostBy(slug: $slug) {
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

  const data = await fetchAPI(query, {
    variables: {
      slug,
    },
  });

  return data?.hspTvPostBy || {};
}
