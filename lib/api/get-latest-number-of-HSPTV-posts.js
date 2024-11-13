import { fetchAPI } from '@lib/fetch-api';

export async function getLatestNumberOfHSPTVPosts(number) {
  const query = /* GraphQL */ `
    query getLatestNumberOfHSPTVPosts($number: Int!) {
      hspTvPosts(first: $number) {
        nodes {
          title
          slug
          uri
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
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

  return await fetchAPI(query, {
    tags: ['hsp-tv'],
    variables: {
      number,
    },
  });
}
