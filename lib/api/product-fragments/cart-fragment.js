// @lib/api/product-fragments/cart-fragment.js
export const CartFragment = /* GraphQL */ `
  fragment CartFragment on Cart {
    contents {
      nodes {
        key
        product {
          node {
            id
            databaseId
            name
          }
        }
        quantity
        subtotal
        total
      }
    }
    contentsTotal
    subtotal
    subtotalTax
    discountTotal
    discountTax
    shippingTotal
    shippingTax
    feeTotal
    feeTax
    total
    totalTax
  }
`;
