import { blocks } from '@lib/blocks';
import { fetchAPI } from '@lib/fetch-api';

// Collections (/collections/[slug]) are terms of the `make-and-model`
// taxonomy. The "Flexible Content Blocks" ACF group is assigned to that
// taxonomy, so editors can add blocks to a collection term in WordPress and
// they come back here under `flexibleContent.blocks`.
export async function getCollectionBlocks(slug) {
  const blocksFragments = Object.values(blocks).map(block => block());

  const query = /* GraphQL */ `
    query getCollectionBlocks($id: ID!) {
      makeAndModel(id: $id, idType: SLUG) {
        flexibleContent {
          blocks {
            ${blocksFragments}
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    tags: [`make-and-model:${slug}`],
    variables: {
      id: slug,
    },
  });

  return data?.makeAndModel?.flexibleContent?.blocks || [];
}
