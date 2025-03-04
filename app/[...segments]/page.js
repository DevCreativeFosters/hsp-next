import { notFound } from 'next/navigation';

import { getSegmentsResolution } from '@lib/api/get-segments-resolution.js';

/**
 * Supported paths:
 * 1: /page-slug -> product category or dynamic page
 * 1: /category-slug -> product category page
 * 1: /category-slug -> product page
 * 2: /page-slug/page-slug -> make or dynamic page
 * 2: /category-slug/make-slug -> make or dynamic page
 * 2: /category-slug/variant-slug -> product page
 * 3: /category-slug/make-slug/model-slug -> product-page
 * 4: /category-slug/make-slug/model-slug/variant-slug -> product-page
 */

const productCategoryOrDynamicPageFile = await import(
  './_product-category-or-dynamic-page/page.js'
);
const makeOrDynamicPageFile = await import('./_make-or-dynamic-page/page.js');
const productPageFile = await import('./_product-page/page.js');

async function getPageFileFromSegments(segments) {
  if (segments.length === 1 || segments.length === 2) {
    const segmentsResolution = await getSegmentsResolution({ segments });

    const isPage = !!segmentsResolution.page;
    const isChildCategory =
      segmentsResolution.productCategory?.parentId !== null;

    const disableL1AndL2PagesValue =
      segmentsResolution.productCategory?.mainCategoryDetails
        .dontCreateL1AndL2PageNorFeatureInTheProductsDropdownAndPage;
    const hasL1AndL2Pages = disableL1AndL2PagesValue === false;
    const doesNotHaveL1AndL2Pages = disableL1AndL2PagesValue === true;

    // dynamic pages are handled by components for category and make pages, they could be separated
    // we do not create pages for top level categories
    // this is either page for product category or make page
    if (isPage || (isChildCategory && hasL1AndL2Pages)) {
      return {
        pageFile:
          segments.length === 1
            ? productCategoryOrDynamicPageFile
            : makeOrDynamicPageFile,
        params: {
          makeSlug: segments[1],
          slug: segments[0],
        },
      };
    }

    // we do not create pages for top level categories
    // this is product page for product without make and model
    // either default variant or variant specific
    if (isChildCategory && doesNotHaveL1AndL2Pages) {
      return {
        pageFile: productPageFile,
        params: { slug: segments[0], variantSlug: segments[1] },
      };
    }

    return null;
  }

  if (segments.length === 3 || segments.length === 4) {
    return {
      pageFile: productPageFile,
      params: {
        makeSlug: segments[1],
        modelSlug: segments[2],
        slug: segments[0],
        variantSlug: segments[3],
      },
    };
  }
}

export async function generateMetadata({ params }) {
  const { segments } = params;
  const resolution = await getPageFileFromSegments(segments);

  if (!resolution) {
    return;
  }

  return resolution.pageFile.generateMetadata({ params: resolution.params });
}

export default async function SegmentsPage({ params }) {
  const { segments } = params;

  if (segments.length === 0 || segments.length > 4) {
    return notFound();
  }

  const resolution = await getPageFileFromSegments(segments);

  if (!resolution) {
    return notFound();
  }

  return resolution.pageFile.default({ params: resolution.params });
}

export async function generateStaticParams() {
  return [];
}
