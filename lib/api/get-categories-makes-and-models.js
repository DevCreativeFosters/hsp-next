import { fetchAPI } from '@lib/fetch-api';

export async function getCategoriesMakesAndModels() {
  const query = /* GraphQL */ `
    query getCategoriesMakesAndModels {
      products {
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
      }
    }
  `;

  const data = await fetchAPI(query);

  return data?.products?.nodes || [];
}
