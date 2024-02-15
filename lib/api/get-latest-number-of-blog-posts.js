import { fetchAPI } from '@lib/fetch-api';

export async function getLatestNumberOfBlogPosts(number) {
  const query = /* GraphQL */ `
    query getLatestNumberOfBlogPosts($number: Int!) {
      posts(first: $number) {
        nodes {
          title
          slug
          uri
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
            }
          }
          tags {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      number,
    },
  });

  return data;
}
