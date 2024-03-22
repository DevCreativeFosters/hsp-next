import { fetchAPI } from '@lib/fetch-api';

export async function getMainProductCategories(excludeTree = []) {
  const query = /* GraphQL */ `
    query getMainProductCategories($excludeTree: [ID]) {
      productCategories(
        where: { parent: null, excludeTree: $excludeTree }
        first: 1000
      ) {
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

  const data = await fetchAPI(query, {
    variables: {
      excludeTree: excludeTree,
    },
  });

  return data?.productCategories?.nodes;
}
