// @lib/api/add-combo-to-cart.js
import { CartFragment } from '@lib/api/product-fragments/cart-fragment';
import { fetchAPI } from '@lib/fetch-api';

/**
 * Add a combo deal to cart
 * @param {Object} input
 * @param {String} input.parentProductId - the main product id
 * @param {String} input.variantSlug - selected variant slug
 * @param {Array} input.comboProductIds - array of extra product ids
 * @param {Number} input.quantity - quantity of the combo
 * @param {Number} input.bundlePrice - total bundle price
 */
export async function addComboToCart({
  bundlePrice = 0,
  comboProductIds,
  parentProductId,
  quantity = 1,
  variantSlug,
}) {
  const mutation = `
    ${CartFragment}
    mutation AddComboToCart(
      $parentProductId: ID!
      $variantSlug: String
      $comboProductIds: [ID!]!
      $quantity: Int!
      $bundlePrice: Float
    ) {
      addComboToCart(
        input: {
          parentProductId: $parentProductId
          variantSlug: $variantSlug
          comboProductIds: $comboProductIds
          quantity: $quantity
          bundlePrice: $bundlePrice
        }
      ) {
        success
        message
        cart {
          ...CartFragment
        }
      }
    }
  `;

  const variables = {
    bundlePrice: parseFloat(bundlePrice),
    comboProductIds,
    parentProductId,
    quantity,
    variantSlug,
  };

  const data = await fetchAPI(
    mutation,
    { variables },
    {
      tags: ['cart'],
    },
  );

  return data?.addComboToCart || {};
}
