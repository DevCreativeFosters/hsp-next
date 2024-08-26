import { fetchAPI } from '@lib/fetch-api';

export const query = `
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
`;

export async function getProductCategories() {
  const data = await fetchAPI(`{ ${query} }`);
  return getResult(data);
}

export function getResult(data) {
  return data?.productCategories?.nodes || [];
}
