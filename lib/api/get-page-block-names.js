import { fetchAPI } from '@lib/fetch-api';
import { blocks } from '@lib/blocks';
import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';
import extractWordBetween from '@lib/extract-word-between';

export async function getPageBlockNames(slug) {
  const query = /* GraphQL */ `
    query pageBlocks($id: ID!) {
      page(id: $id, idType: URI) {
        flexibleContent {
          blocks {${Object.keys(blocks)
            .map(
              name => `
            ... on ${blockPrefix}${name}${blockSuffix} {
              fieldGroupName
            }`,
            )
            .join('')}
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

  return data?.page?.flexibleContent?.blocks
    ?.map(b => extractWordBetween(b?.fieldGroupName, blockPrefix, blockSuffix))
    .filter(Boolean);
}
