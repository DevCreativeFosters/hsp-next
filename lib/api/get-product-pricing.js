import { fetchAPI } from '@lib/fetch-api';

const query = /* GraphQL */ `
  query GetProductPricing($productId: ID!) {
    product(id: $productId, idType: DATABASE_ID) {
      databaseId
      currentTier
      pricingBadge
      discountPercent
      variantPricing {
        sku
        variantSlug
        variantName
        price
        tierPrice
      }
    }
  }
`;

export async function getProductPricing(productId) {
  if (!productId) return null;

  try {
    const data = await fetchAPI(query, {
      tags: [`product-pricing:${productId}`],
      variables: { productId: Number(productId) },
    });
    return data?.product || null;
  } catch (err) {
    console.error('getProductPricing failed:', err?.message || err);
    return null;
  }
}
