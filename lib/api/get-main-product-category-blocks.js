import { blocks } from '@lib/blocks';
import { fetchAPI } from '@lib/fetch-api';

export async function getMainProductCategoryBlocks(slug) {
  const blocksFragments = Object.values(blocks).map(block =>
    block('product_category'),
  );

  const query = /* GraphQL */ `
    query getMainProductCategoryBlocks($id: ID!) {
      productCategory(id: $id, idType: SLUG) {
        flexibleContent {
          blocks {
            ${blocksFragments}
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      id: slug,
    },
  });

  return data?.productCategory || {};
}
