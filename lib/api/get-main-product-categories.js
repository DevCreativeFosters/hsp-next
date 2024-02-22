import { fetchAPI } from '@lib/fetch-api';

export async function getMainProductCategories() {
  const query = /* GraphQL */ `
    query getMainProductCategories {
      productCategories(where: { parent: null }, first: 1000) {
        nodes {
          databaseId
          id
          name
          description
          children(first: 1000) {
            nodes {
              databaseId
              id
              name
              slug
              parent {
                node {
                  id
                }
              }
              mainCategoryDetails {
                featuredImage {
                  node {
                    sourceUrl
                    mediaDetails {
                      width
                      height
                    }
                  }
                }
                fromPrice
                productImage {
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
      }
    }
  `;

  const data = await fetchAPI(query);

  return data?.productCategories?.nodes;
}
