import { ProductWithVariants } from '@lib/api/product-fragments/product-with-variants';
import { fetchAPI } from '@lib/fetch-api';

export default async function getRelatedCovers(make, model, mainCategorySlug) {
  const query = `
    ${ProductWithVariants}
    query getRelatedCovers(
      $modelSlug: [String]
      $makeSlug: [String]
      $mainCategorySlug: [String]
    ) {
      products(
        where: {
          modelSlug: $modelSlug
          makeSlug: $makeSlug
          mainCategorySlug: $mainCategorySlug
        }
        first: 100
      ) {
        nodes {
          ...ProductFragment
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      makeSlug: make,
      modelSlug: model,
      mainCategorySlug: mainCategorySlug,
    },
  });

  if (!data) {
    return [];
  }
  return data?.products?.nodes;
}
