import { seoFields } from '@lib/api/common/seo-fields';
import { fetchAPI } from '@lib/fetch-api';

export async function getProductCategorySeo(slug, type = 'productCategory') {
  const query = /* GraphQL */ `
    query getProductCategorySeo($slug: ID!) {
      productCategory(id: $slug, idType: SLUG) {
        ${seoFields}
      }
    }
  `;

  const data = await fetchAPI(query, {
    tags: [`product-category:${slug}`],
    variables: {
      slug,
    },
  });

  if (!data?.productCategory?.seo) return {};

  return {
    description: data.productCategory.seo.metaDesc,
    openGraph: {
      description: data.productCategory.seo.opengraphDescription,
      images: [data.productCategory.seo.opengraphImage?.sourceUrl],
      siteName: data.productCategory.seo.opengraphTitle,
      title: data.productCategory.seo.title,
      url: data.productCategory.seo.opengraphUrl,
    },
    robots: {
      follow: data.productCategory.seo.metaRobotsNofollow,
      index: data.productCategory.seo.metaRobotsNoindex,
    },
    title: data.productCategory.seo.title,
  };
}
