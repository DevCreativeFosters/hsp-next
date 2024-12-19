import { ProductWithBlocksFragment } from '@lib/api/product-fragments/product-with-blocks';
import { fetchAPI } from '@lib/fetch-api';

export async function getProductsByCategoriesSlugs(
  mainCategorySlug,
  makeSlug,
  modelSlug,
) {
  const queryWithModelSlug = `
    ${ProductWithBlocksFragment}
    query getProductsByCategoriesSlugs(
      $mainCategorySlug: [String]!
      $makeSlug: [String]!
      $modelSlug: [String]!
    ) {
      products(
        where: {
          mainCategorySlug: $mainCategorySlug
          makeSlug: $makeSlug
          modelSlug: $modelSlug
        }
      ) {
        nodes {
          ...ProductWithBlocksFragment
        }
      }
    }
  `;

  const queryWithoutModelSlug = `
    ${ProductWithBlocksFragment}
    query getProductsByCategoriesSlugs(
      $mainCategorySlug: [String]!
      $makeSlug: [String]!
    ) {
      products(
        where: { mainCategorySlug: $mainCategorySlug, makeSlug: $makeSlug }
      ) {
        nodes {
          ...ProductWithBlocksFragment
        }
      }
    }
  `;

  const tags = [
    `product-category:${mainCategorySlug}`,
    `make-and-model:${makeSlug}`,
    modelSlug ? `make-and-model:${modelSlug}` : '',
    'product',
  ].filter(Boolean);

  const query = modelSlug ? queryWithModelSlug : queryWithoutModelSlug;
  const variables = {
    mainCategorySlug: mainCategorySlug,
    makeSlug: makeSlug,
    ...(modelSlug ? { modelSlug: modelSlug } : {}),
  };

  const data = await fetchAPI(query, {
    tags: tags,
    variables: variables,
  });

  return data.products?.nodes;
}
