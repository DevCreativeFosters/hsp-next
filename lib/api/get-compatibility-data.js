import { fetchAPI } from '@lib/fetch-api';

export default async function getCompatibilityData(mainCategoryId) {
  const query = `
    fragment NodeFields on Product_category {
      databaseId
      id
      name
      slug
    }
    query getCompatibilityData(
      $mainCategoryId: Int
    ) {
      productCategories(
        where: {
          parent: $mainCategoryId
        }
        first: 100
      ) {
        nodes {
          id
          name
          slug
          categoryRelations {
            productMatrix {
              nodes {
                ...NodeFields
              }
            }
            covers {
              nodes {
                ...NodeFields
              }
            }
            factoryOptions {
              nodes {
                ...NodeFields
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      mainCategoryId: mainCategoryId,
    },
  });

  if (!data) {
    return [];
  }
  return data?.productCategories?.nodes;
}
