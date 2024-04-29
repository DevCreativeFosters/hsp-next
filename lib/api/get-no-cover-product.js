import { ProductWithVariants } from '@lib/api/product-fragments/product-with-variants';
import { fetchAPI } from '@lib/fetch-api';

export default async function getNoCoverProduct(noCoverSlug) {
  const query = `
    ${ProductWithVariants}
    query getNoCover($noCoverSlug: [String]) {
      products(where: { mainCategorySlug: $noCoverSlug }, first: 100) {
        nodes {
          ...ProductFragment
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      noCoverSlug: noCoverSlug,
    },
  });

  if (!data) {
    return [];
  }
  return data?.products?.nodes;
}
