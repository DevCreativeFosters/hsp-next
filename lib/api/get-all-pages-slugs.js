import { fetchAPI } from '@lib/fetch-api';

export default async function getAllPagesSlugs() {
  const query = /* GraphQL */ `
    query getAllPagesSlugs {
      pages(first: 1000) {
        nodes {
          slug
          children(first: 1000) {
            nodes {
              slug
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    tags: ['page'],
  });

  return data?.pages?.nodes || [];
}
