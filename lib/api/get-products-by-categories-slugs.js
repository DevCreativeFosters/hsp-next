import { ProductWithBlocksFragment } from '@lib/api/product-fragments/product-with-blocks';
import { fetchAPI } from '@lib/fetch-api';

const asArray = value => (Array.isArray(value) ? value : [value]);

// TODO: this could probably be simplified as passing empty array for condition seems to be the same as not passing the condition

export async function getProductsByCategoriesSlugs(
  mainCategorySlug,
  makeSlug,
  modelSlug,
) {
  const queryWithModelSlug = `
    ${ProductWithBlocksFragment}
    query getProductsByCategoriesSlugs(
      $mainCategorySlug: [String]!
      $makeSlug: [String]!
      $modelSlug: [String]!
    ) {
      products(
        where: {
          mainCategorySlug: $mainCategorySlug
          makeSlug: $makeSlug
          modelSlug: $modelSlug
        }
      ) {
        nodes {
          ...ProductWithBlocksFragment
        }
      }
    }
  `;

  const queryWithoutModelSlug = `
    ${ProductWithBlocksFragment}
    query getProductsByCategoriesSlugs(
      $mainCategorySlug: [String]!
      $makeSlug: [String]!
    ) {
      products(
        where: { mainCategorySlug: $mainCategorySlug, makeSlug: $makeSlug }
      ) {
        nodes {
          ...ProductWithBlocksFragment
        }
      }
    }
  `;

  const queryWithoutMakeAndModelSlugs = `
    ${ProductWithBlocksFragment}
    query getProductsByCategoriesSlugs(
      $mainCategorySlug: [String]!
    ) {
      products(
        where: { mainCategorySlug: $mainCategorySlug }
      ) {
        nodes {
          ...ProductWithBlocksFragment
        }
      }
    }
  `;

  const tags = [
    `product-category:${mainCategorySlug}`,
    `make-and-model:${makeSlug}`,
    modelSlug ? `make-and-model:${modelSlug}` : '',
    'product',
    // TODO: avoid tag for all products, also in few other places
  ].filter(Boolean);

  const query =
    !makeSlug && !modelSlug
      ? queryWithoutMakeAndModelSlugs
      : modelSlug
        ? queryWithModelSlug
        : queryWithoutModelSlug;
  const variables = {
    mainCategorySlug: asArray(mainCategorySlug),
    ...(makeSlug ? { makeSlug: asArray(makeSlug) } : {}),
    ...(modelSlug ? { modelSlug: asArray(modelSlug) } : {}),
  };

  const data = await fetchAPI(query, {
    tags: tags,
    variables: variables,
  });

  return data.products?.nodes;
}
