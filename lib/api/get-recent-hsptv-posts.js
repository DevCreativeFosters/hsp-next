import { fetchAPI } from '@lib/fetch-api';

export async function getRecentHspTvPosts(numberOfPosts) {
  const query = /* GraphQL */ `
    query hspTvPosts($numberOfPosts: Int!) {
      hspTvPosts(last: $numberOfPosts) {
        nodes {
          id
          title
          uri
          slug
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      numberOfPosts,
    },
  });

  return data?.hspTvPosts?.nodes || [];
}
