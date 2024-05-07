import { fetchAPI } from '@lib/fetch-api';

export async function getBlogPost(slug) {
  const query = /* GraphQL */ `
    query getBlogPost($slug: String!) {
      postBy(slug: $slug) {
        content
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
        excerpt
        title
        uri
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      slug,
    },
  });

  return data?.postBy || {};
}
