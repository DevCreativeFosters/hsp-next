import { fetchAPI } from '@lib/fetch-api';

export async function getRecentBlogPosts(numberOfPosts) {
  const query = /* GraphQL */ `
    query getRecentBlogPosts($numberOfPosts: Int!) {
      posts(last: $numberOfPosts) {
        nodes {
          title
          uri
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      numberOfPosts,
    },
  });

  return data?.posts?.nodes;
}
