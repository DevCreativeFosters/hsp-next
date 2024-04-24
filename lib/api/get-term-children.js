import { fetchAPI } from '@lib/fetch-api';

export async function getTermChildren(parentSlug) {
  const query = `
    query getTermChildren($parentSlug: ID!) {
      productCategory(id: $parentSlug, idType: SLUG) {
        name
        slug
        children(first: 1000) {
          nodes {
            value: name
            slug
            mainCategoryDetails {
              productImage {
                node {
                  sourceUrl
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      parentSlug,
    },
  });

  return data?.productCategory?.children?.nodes || [];
}
