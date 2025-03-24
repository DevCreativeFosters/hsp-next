import { ProductWithBlocksFragment } from '@lib/api/product-fragments/product-with-blocks';
import { fetchAPI } from '@lib/fetch-api';

export async function getProductPreview(id) {
  const query = /* GraphQL */ `
    ${ProductWithBlocksFragment}
    query getProductPreview($id: ID!) {
      product(id: $id, idType: DATABASE_ID) {
        ...ProductWithBlocksFragment
      }
    }
  `;

  const data = await fetchAPI(
    query,
    {
      tags: ['product', 'schemas'],
      variables: {
        id,
      },
    },
    true,
  );

  return data.product;
}
