import { fetchAPI } from '@lib/fetch-api';

export const query = `
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
`;

export async function getMenuDropdownProducts() {
  const data = await fetchAPI(`{ ${query} }`);
  return getResult(data);
}

export function getResult(data) {
  return data?.products?.nodes || [];
}
