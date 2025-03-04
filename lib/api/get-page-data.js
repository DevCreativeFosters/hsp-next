import { getPageBlockNames } from '@lib/api/get-page-block-names';
import { resolvePreview } from '@lib/api/get-post-type-preview';
import { blocks } from '@lib/blocks';
import { fetchAPI } from '@lib/fetch-api';
import { generateTags } from '@lib/helpers';

export async function getPageData(slug, preview) {
  const [asPreview, id] = await resolvePreview(slug, preview, 'page');
  const blocksOrdered = (await getPageBlockNames(slug, preview)) || [];
  const blocksFragments = blocksOrdered.map(blockName => blocks[blockName]());

  const query = `
    query getPageData($id: ID!, $idType: PageIdType!, $asPreview: Boolean!) {
      page(id: $id, idType: $idType, asPreview: $asPreview) {
        parent {
          node {
            uri
          }
        }
        title
        content
        isPreview
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

  const tags = generateTags(slug);

  const data = await fetchAPI(
    query,
    {
      tags: tags,
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

  return data?.page || null;
}
