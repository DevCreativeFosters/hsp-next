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
          lifestyleBlock {
            titleTagType
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

  return await fetchAPI(query, {
    tags: ['post'],
    variables: {
      number,
    },
  });
}
