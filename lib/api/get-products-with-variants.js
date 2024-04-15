import { ProductWithVariants } from '@lib/api/product-fragments/product-with-variants';
import { fetchAPI } from '@lib/fetch-api';

export async function getProductsWithVariants(
  makeSlug,
  modelSlug,
  excludedCategories,
) {
  const excludedCategoriesArray = excludedCategories
    .split(',')
    .map(category => category.trim());

  const query = /* GraphQL */ `
    ${ProductWithVariants}
    query getProductsWithVariants(
      $makeSlug: [String]!
      $modelSlug: [String]!
      $excludedCategories: [String]
    ) {
      products(
        where: {
          makeSlug: $makeSlug
          modelSlug: $modelSlug
          mainCategoryNotIn: $excludedCategories
        }
      ) {
        nodes {
          ...ProductFragment
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      excludedCategories: excludedCategoriesArray,
      makeSlug: makeSlug,
      modelSlug: modelSlug,
    },
  });

  return data.products?.nodes;
}
