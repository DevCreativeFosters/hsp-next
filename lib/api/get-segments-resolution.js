import { fetchAPI } from '@lib/fetch-api';

/**
 * This could be expanded to:
 * - fetch more data to reduce requests in page specific components
 * - fetch more data to validate correctness of make and model
 * - check for category exclusion
 */

const query = /* GraphQL */ `
  query getSegmentsResolution(
    $productCategorySlug: ID!
    $pageUri: ID!
    $includePage: Boolean!
    $includeProductCategory: Boolean!
  ) {
    # one segment - dynamic page
    # two segments - dynamic page
    page(idType: URI, id: $pageUri) @include(if: $includePage) {
      id
    }

    # one segment - product category (may be with L1 & L2 or without)
    # two segments - product page with variant
    # we need enough fields to determine if this is a category with L1 & L2 or without
    # we also need to check if this is sub category not a main category
    productCategory(idType: SLUG, id: $productCategorySlug)
      @include(if: $includeProductCategory) {
      parentId
      mainCategoryDetails {
        dontCreateL1AndL2PageNorFeatureInTheProductsDropdownAndPage
      }
    }

    # two segments - product category with make page
    # we do not check if second segment is a make
    # only if category is valid and allows L2 pages or not

    # three segments - product page based on category, make and model
    # we do not query about that as this is only scenario for 3 segments

    # four segments - product page based on category, make and model, with variant
    # we do not query about that as this is only scenario for 4 segments
  }
`;

export async function getSegmentsResolution({ segments }) {
  const includePage = segments.length === 1 || segments.length === 2;
  const includeProductCategory = segments.length === 1 || segments.length === 2;

  const data = await fetchAPI(query, {
    tags: [
      includePage && `page:${segments.join('/')}`,
      includeProductCategory && `product-category:${segments[0]}`,
    ].filter(Boolean),
    variables: {
      includePage,
      includeProductCategory,
      pageUri: `/${segments.join('/')}`,
      productCategorySlug: segments[0],
    },
  });
  return data;
}
