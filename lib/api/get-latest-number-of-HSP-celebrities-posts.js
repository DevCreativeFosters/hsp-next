import { fetchAPI } from '@lib/fetch-api';

export async function getLatestNumberOfHSPCelebritiesPosts(number) {
  const query = /* GraphQL */ `
    query getLatestNumberOfHSPCelebritiesPosts($number: Int!) {
      celebrities(first: $number) {
        nodes {
          title
          id
          slug
          celebrityPostsCustomFields {
            thumbnail {
              node {
                altText
                sourceUrl
              }
            }
            video {
              node {
                mediaItemUrl
              }
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
