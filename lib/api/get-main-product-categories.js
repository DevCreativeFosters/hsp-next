import { fetchAPI } from '@lib/fetch-api';

export const query = `
  productCategories(
    where: { parent: null, excludeTree: $excludeTree }
    first: 1000
  ) {
    nodes {
      databaseId
      id
      name
      description
      children(first: 1000, where: { exclude: $excludeChildren }) {
        nodes {
          databaseId
          id
          name
          slug
          parent {
            node {
              id
              databaseId
            }
          }
          mainCategoryDetails {
            dontCreateL1AndL2PageNorFeatureInTheProductsDropdownAndPage
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
`;

export async function getMainProductCategories(
  excludeTree = [],
  excludeChildren = [],
) {
  const data = await fetchAPI(
    `query getMainProductCategories($excludeTree: [ID], $excludeChildren: [ID]) { ${query} }`,
    {
      tags: ['product-category'],
      variables: {
        excludeChildren,
        excludeTree,
      },
    },
  );

  return data?.productCategories?.nodes || [];
}
