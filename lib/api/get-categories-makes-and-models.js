import { fetchAPI } from '@lib/fetch-api';

export async function getCategoriesMakesAndModels() {
  const query = /* GraphQL */ `
    query getAllCategoriesMakesAndModels($after: String) {
      products(first: 100, after: $after) {
        nodes {
          makesAndModels {
            nodes {
              name
              slug
              children {
                nodes {
                  name
                  slug
                }
              }
            }
          }
          productCategories {
            nodes {
              name
              slug
              parent {
                node {
                  id
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const allProducts = [];
  let hasNextPage = true;
  let after = null;

  while (hasNextPage) {
    const data = await fetchAPI(query, {
      tags: ['make-and-model'],
      variables: { after },
    });

    const { nodes, pageInfo } = data?.products || {};
    if (nodes) {
      allProducts.push(...nodes);
    }

    hasNextPage = pageInfo?.hasNextPage;
    after = pageInfo?.endCursor;
  }

  return allProducts;
}
