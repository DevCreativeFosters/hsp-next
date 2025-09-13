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
            ... on SimpleProduct {
              price
            }
            ... on VariableProduct {
              price
            }
          }
        }
        quantity
        subtotal
        total
        variation {
          attributes {
            id
            name
            value
          }
        }
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
    isEmpty
    displayPricesIncludeTax
    needsShippingAddress

    appliedCoupons {
      code
      discountAmount
    }

    fees {
      name
      amount
    }

    totalTaxes {
      amount
      rate
    }
  }
`;
