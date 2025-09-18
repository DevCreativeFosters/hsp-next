import { CartFragment } from '@lib/api/product-fragments/cart-fragment';
import { fetchAPI } from '@lib/fetch-api';

export async function addComboToCart({ products, quantity = 1 }) {
  const mutation = `
    ${CartFragment}
    mutation AddComboToCart(
      $products: [ComboProductInput!]!
      $quantity: Int!
    ) {
      addComboToCart(
        input: {
          products: $products
          quantity: $quantity
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

  const variables = { products, quantity };

  const data = await fetchAPI(mutation, { variables }, { tags: ['cart'] });

  return data?.addComboToCart || {};
}
