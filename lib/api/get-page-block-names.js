import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';
import { resolvePreview } from '@lib/api/get-post-type-preview';
import { blocks } from '@lib/blocks';
import extractWordBetween from '@lib/extract-word-between';
import { fetchAPI } from '@lib/fetch-api';

export async function getPageBlockNames(slug, preview = false) {
  const [asPreview, id] = await resolvePreview(slug, preview, 'page');

  const query = /* GraphQL */ `
    query pageBlocks($id: ID!, $idType: PageIdType!, $asPreview: Boolean!) {
      page(id: $id, idType: $idType, asPreview: $asPreview) {
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

  const data = await fetchAPI(
    query,
    {
      variables: {
        asPreview,
        id: asPreview
          ? id
          : String(slug).slice(0, 1) === '/'
            ? slug
            : `/${slug}`,
        idType: asPreview ? 'DATABASE_ID' : 'URI',
      },
    },
    asPreview,
  );

  return data?.page?.flexibleContent?.blocks
    ?.map(b => extractWordBetween(b?.fieldGroupName, blockPrefix, blockSuffix))
    .filter(Boolean);
}
