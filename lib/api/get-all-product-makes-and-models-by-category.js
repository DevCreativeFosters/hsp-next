import { fetchAPI } from '@lib/fetch-api';

export async function getAllProductMakesAndModelsByCategory(mainCategorySlug) {
  const query = /* GraphQL */ `
    query getAllProductMakesAndModelsByCategory($mainCategorySlug: [String]!) {
      products(where: { mainCategorySlug: $mainCategorySlug }, first: 100) {
        nodes {
          title
          makesAndModels {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      mainCategorySlug: mainCategorySlug,
    },
  });

  return data?.products?.nodes || [];
}
