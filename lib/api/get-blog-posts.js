import { fetchAPI } from '@lib/fetch-api';

export async function getBlogPosts(numberOfPosts = 9999, offset = 0) {
  const query = /* GraphQL */ `
    query GetBlogPosts($numberOfPosts: Int!, $offset: Int!) {
      posts(
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
    variables: {
      numberOfPosts,
      offset,
    },
  });
}
