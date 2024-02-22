import { fetchAPI } from '@lib/fetch-api';

export async function getMake(slug) {
  const query = /* GraphQL */ `
    query getMake($id: ID!) {
      makeAndModel(id: $id, idType: SLUG) {
        databaseId
        name
        description
        slug
        detailsFields {
          details {
            relatedProductCategory {
              nodes {
                name
                slug
              }
            }
            featuredImage {
              node {
                mediaItemUrl
                mediaDetails {
                  width
                  height
                }
              }
            }
            videoUrl
            features
            fromPrice
            warranty {
              warrantyTimePeriod
              warrantyDescription
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

  return data.makeAndModel;
}
