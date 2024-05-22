import { ProductWithVariants } from '@lib/api/product-fragments/product-with-variants';
import { fetchAPI } from '@lib/fetch-api';

export default async function getNoCoverProduct(
  noCoverSlug,
  makeSlug,
  modelSlug,
) {
  const query = `
    ${ProductWithVariants}
    query getNoCover(
      $makeSlug: [String]!
      $modelSlug: [String]!
      $noCoverSlug: [String]
    ) {
      products(where: {
        makeSlug: $makeSlug
        modelSlug: $modelSlug
        mainCategorySlug: $noCoverSlug
      }, first: 1) {
        nodes {
          ...ProductFragment
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      makeSlug: makeSlug,
      modelSlug: modelSlug,
      noCoverSlug: noCoverSlug,
    },
  });

  if (!data) {
    return [];
  }

  return data?.products?.nodes || [];
}
