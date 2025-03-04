import { ProductWithVariants } from '@lib/api/product-fragments/product-with-variants';
import { fetchAPI } from '@lib/fetch-api';

export async function getProductsWithVariants(
  makeSlug,
  modelSlug,
  excludedCategories,
  noMakeAndModel = false,
) {
  const excludedCategoriesArray = excludedCategories
    .split(',')
    .map(category => category.trim());

  const query = /* GraphQL */ `
    ${ProductWithVariants}
    query getProductsWithVariants(
      $makeSlug: [String]
      $modelSlug: [String]
      $excludedCategories: [String]
      $noMakeAndModel: Boolean
    ) {
      products(
        where: {
          makeSlug: $makeSlug
          modelSlug: $modelSlug
          mainCategoryNotIn: $excludedCategories
          noMakeAndModel: $noMakeAndModel
        }
      ) {
        nodes {
          ...ProductFragment
        }
      }
    }
  `;

  const tags = [
    `make-and-model:${makeSlug}`,
    `make-and-model:${modelSlug}`,
    'product-category',
    'product',
  ];

  const data = await fetchAPI(query, {
    tags: tags,
    variables: {
      excludedCategories: excludedCategoriesArray,
      makeSlug: makeSlug,
      modelSlug: modelSlug,
      noMakeAndModel: noMakeAndModel,
    },
  });

  return data?.products?.nodes || [];
}
