import { blocks } from '@lib/blocks';
import { fetchAPI } from '@lib/fetch-api';

export async function getMakeAndModelBlocks(slug) {
  const blocksFragments = Object.values(blocks).map(block => block('make'));

  const query = /* GraphQL */ `
    query getMakeAndModelBlocks($id: ID!) {
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
    variables: { id: slug },
  });

  return data?.makeAndModel?.flexibleContent?.blocks || [];
}
