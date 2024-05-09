import { fetchAPI } from '@lib/fetch-api';

export async function getProductCategories() {
  const query = /* GraphQL */ `
    query getProductCategories {
      productCategories(first: 9999) {
        nodes {
          name
          slug
          id
          parent {
            node {
              id
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query);

  return data?.productCategories?.nodes || [];
}
