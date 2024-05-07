import { getPageBlockNames } from '@lib/api/get-page-block-names';
import { blocks } from '@lib/blocks';
import { fetchAPI } from '@lib/fetch-api';

export async function getPageData(slug) {
  const blocksOrdered = (await getPageBlockNames(slug)) || [];
  const blocksFragments = blocksOrdered.map(blockName => blocks[blockName]());

  const query = /* GraphQL */ `
    query getPageData($id: ID!) {
      page(id: $id, idType: URI) {
        title
        content
        ${
          blocksFragments.length > 0
            ? `flexibleContent {
            blocks {
              ${blocksFragments}
            }
        }`
            : ''
        }
        supportPagesContent {
          accordions {
            title
            content
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      id: String(slug).slice(0, 1) === '/' ? slug : `/${slug}`,
    },
  });

  return data?.page || {};
}
