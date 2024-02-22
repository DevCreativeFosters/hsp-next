import { fetchAPI } from '@lib/fetch-api';

export async function getMenuDropdownProducts() {
  const query = /* GraphQL */ `
    query getMenuDropdownProducts {
      products {
        nodes {
          title
          featuredImage {
            node {
              sourceUrl
            }
          }
          productId
          slug
          productCategories {
            nodes {
              name
              id
              slug
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query);

  return data?.products?.nodes;
}
