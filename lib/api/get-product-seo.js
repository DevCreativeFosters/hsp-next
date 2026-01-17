import { seoFields } from '@lib/api/common/seo-fields';
import { fetchAPI } from '@lib/fetch-api';
import { metadata } from '@lib/seo';

export async function getProductSeo(categorySlug, makeSlug, modelSlug) {
  const query = /* GraphQL */ `
    query getProductSeo(
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
        first: 1
      ) {
        nodes {
          ${seoFields}
        }
      }
    }
  `;

  const tags = [
    `product-category:${categorySlug}`,
    `make-and-model:${makeSlug}`,
    `make-and-model:${modelSlug}`,
    'product',
  ];

  const variables = {
    mainCategorySlug: [categorySlug],
    makeSlug: [makeSlug].filter(Boolean),
    modelSlug: [modelSlug].filter(Boolean),
  };

  const data = await fetchAPI(query, {
    tags: tags,
    variables: variables,
  });

  const product = data?.products?.nodes[0];

  if (!product || !product.seo) {
    return {};
  }

  const seo = product.seo;
  const seoURL = `${metadata.metadataBase}/${categorySlug}/${makeSlug}/${modelSlug}`;

  return {
    alternates: {
      canonical: seo.canonical,
    },
    description: seo.metaDesc,
    openGraph: {
      description: seo.opengraphDescription,
      images: [seo.opengraphImage?.sourceUrl],
      siteName: seo.opengraphTitle,
      title: seo.title,
      url: seoURL,
    },
    robots: {
      follow: false,
      index: false,
    },
    title: seo.title,
  };
}
