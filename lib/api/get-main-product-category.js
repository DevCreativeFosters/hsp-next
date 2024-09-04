import { fetchAPI } from '@lib/fetch-api';

export async function getMainProductCategory(slug) {
  const query = /* GraphQL */ `
    query getMainProductCategory($id: ID!) {
      productCategory(id: $id, idType: SLUG) {
        databaseId
        name
        description
        mainCategoryDetails {
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
  `;

  const data = await fetchAPI(query, {
    tags: [`product-category:${slug}`],
    variables: {
      id: slug,
    },
  });

  return data?.productCategory || {};
}
