import { ProductWithBlocksFragment } from '@lib/api/product-fragments/product-with-blocks';
import { fetchAPI } from '@lib/fetch-api';

export async function getProductPreview(id) {
  const query = /* GraphQL */ `
    ${ProductWithBlocksFragment}
    query getProductPreview($id: ID!) {
      product(id: $id, idType: DATABASE_ID, asPreview: true) {
        ...ProductWithBlocksFragment
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      id,
    },
  });

  return data.products?.nodes;
}
