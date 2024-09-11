import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';
import { getCategoriesMakesAndModels } from '@lib/api/get-categories-makes-and-models';
import { resolvePreview } from '@lib/api/get-post-type-preview';
import { blocks } from '@lib/blocks';
import extractWordBetween from '@lib/extract-word-between';
import { fetchAPI } from '@lib/fetch-api';
import { generateTags } from '@lib/helpers';
import formatCategories from '@lib/normalize-product-breadcrumbs';

export async function getPageBlockNames(slug, preview = false) {
  const [asPreview, id] = await resolvePreview(slug, preview, 'page');
  const categoryMakesAndModels = await getCategoriesMakesAndModels();
  const formattedData = formatCategories(categoryMakesAndModels);

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

  const tags = generateTags(slug, formattedData);

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

  return data?.page?.flexibleContent?.blocks
    ?.map(b => extractWordBetween(b?.fieldGroupName, blockPrefix, blockSuffix))
    .filter(Boolean);
}
