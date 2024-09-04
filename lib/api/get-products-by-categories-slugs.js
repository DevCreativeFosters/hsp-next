import { ProductWithBlocksFragment } from '@lib/api/product-fragments/product-with-blocks';
import { fetchAPI } from '@lib/fetch-api';

export async function getProductsByCategoriesSlugs(
  mainCategorySlug,
  makeSlug,
  modelSlug,
) {
  const query = /* GraphQL */ `
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

  const tags = [
    `product-category:${mainCategorySlug}`,
    `make-and-model:${makeSlug}`,
    `make-and-model:${modelSlug}`,
    'product',
  ];

  const data = await fetchAPI(query, {
    tags: tags,
    variables: {
      mainCategorySlug: mainCategorySlug,
      makeSlug: makeSlug,
      modelSlug: modelSlug,
    },
  });

  return data.products?.nodes;
}
