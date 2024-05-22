import { fetchAPI } from '@lib/fetch-api';

export async function getModelBySlug(slug) {
  const query = /* GraphQL */ `
    query getModelBySlug($id: ID!) {
      makeAndModel(id: $id, idType: SLUG) {
        databaseId
        name
        slug
        uteBuilderImages {
          imageDesktop {
            node {
              sourceUrl
              mediaDetails {
                width
                height
              }
            }
          }
          imageMobile {
            node {
              sourceUrl
              mediaDetails {
                width
                height
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      id: slug,
    },
  });

  return data?.makeAndModel || {};
}
