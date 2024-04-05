import { ProductWithVariants } from '@lib/api/product-fragments/product-with-variants';
import { fetchAPI } from '@lib/fetch-api';

export async function getProductsWithVariants(makeSlug, modelSlug) {
  const query = /* GraphQL */ `
    ${ProductWithVariants}
    query getProductsWithVariants($makeSlug: [String]!, $modelSlug: [String]!) {
      products(where: { makeSlug: $makeSlug, modelSlug: $modelSlug }) {
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
    },
  });

  return data.products?.nodes;
}
