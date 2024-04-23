import { fetchAPI } from '@lib/fetch-api';

export async function getAllPostsSlugs() {
  const data = await fetchAPI(`
    {
      posts(first: 10000) {
        nodes {
          slug
        }
      }
    }
  `);

  return data?.posts?.nodes || [];
}
