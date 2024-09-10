import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';
import { getCategoriesMakesAndModels } from '@lib/api/get-categories-makes-and-models';
import { resolvePreview } from '@lib/api/get-post-type-preview';
import { blocks } from '@lib/blocks';
import extractWordBetween from '@lib/extract-word-between';
import { fetchAPI } from '@lib/fetch-api';
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

  const slugParts = slug.split('/').filter(Boolean);
  let tags = [];

  if (slugParts.length === 0) {
    tags = ['page:home'];
  } else {
    const category = formattedData.find(c => c.slug === slugParts[0]);
    if (category) {
      tags.push(`product-category:${category.slug}`);
      if (slugParts.length > 1) {
        const make = category.makes.find(m => m.slug === slugParts[1]);
        if (make) {
          tags.push(`make-and-model:${make.slug}`);
          if (slugParts.length > 2) {
            const model = make.models.find(m => m.slug === slugParts[2]);
            if (model) {
              tags.push(`make-and-model:${make.slug}/${model.slug}`);
            }
          }
        }
      }
    } else {
      tags.push(`page:${slug}`);
    }
  }

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
