import { fetchAPI } from '@lib/fetch-api';

// Products to suggest in the /cart "More Accessories to Add:"
// carousel — Figma node 658:12937. We just need name, image, a
// base price, and variants (so the popup can render a variant
// picker + Add to Cart). Kept intentionally light — no reviews,
// no compatibility filters — this is upsell, not the PDP.
const QUERY = `
  query CartAccessories($count: Int!) {
    products(first: $count) {
      nodes {
        databaseId
        slug
        title
        commentCount
        comments(first: 100) {
          nodes {
            rating
          }
        }
        productCategories(first: 1) {
          nodes {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        productFields {
          price
          installationCost
          freight
          images {
            nodes {
              mediaItemUrl
              altText
            }
          }
          variants {
            variantName
            variantSlug
            sku
            parentInherit
            variantDetails {
              price
              compareAtPrice
              installationCost
              images {
                nodes {
                  mediaItemUrl
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCartAccessories(count = 4) {
  try {
    const data = await fetchAPI(QUERY, {
      tags: ['product', 'cart-accessories'],
      variables: { count },
    });
    return data?.products?.nodes || [];
  } catch (err) {
    console.error('getCartAccessories failed:', err?.message);
    return [];
  }
}
