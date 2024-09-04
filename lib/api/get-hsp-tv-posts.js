import { fetchAPI } from '@lib/fetch-api';

export async function getHspTvPosts(numberOfPosts = 9999, offset = 0) {
  const query = /* GraphQL */ `
    query GetHspTVPosts($numberOfPosts: Int!, $offset: Int!) {
      hspTvPosts(
        where: { offsetPagination: { size: $numberOfPosts, offset: $offset } }
      ) {
        pageInfo {
          offsetPagination {
            #TODO: use cursor pagination
            total
          }
        }
        nodes {
          date
          featuredImage {
            node {
              sourceUrl
              altText
              title
              mediaDetails {
                width
                height
              }
            }
          }
          id
          uri
          title
          excerpt
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
    tags: ['hsp_tv'],
    variables: {
      numberOfPosts,
      offset,
    },
  });
}
