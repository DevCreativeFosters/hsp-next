import { seoFields } from '@lib/api/common/seo-fields';
import { fetchAPI } from '@lib/fetch-api';

export async function getMakeModelSeo(slug, type = 'productCategory') {
  const query = /* GraphQL */ `
    query getMakeModelSeo($slug: ID!) {
      makeAndModel(id: $slug, idType: SLUG) {
        ${seoFields}
      }
    }
  `;

  const data = await fetchAPI(query, {
    tags: [`make-and-model:${slug}`],
    variables: {
      slug,
    },
  });

  if (!data?.makeAndModel?.seo) return {};

  return {
    alternates: {
      canonical: data.makeAndModel.seo.canonical,
    },
    description: data.makeAndModel.seo.metaDesc,
    openGraph: {
      description: data.makeAndModel.seo.opengraphDescription,
      images: [data.makeAndModel.seo.opengraphImage?.sourceUrl],
      siteName: data.makeAndModel.seo.opengraphTitle,
      title: data.makeAndModel.seo.title,
      url: data.makeAndModel.seo.opengraphUrl,
    },
    robots: {
      follow: false,
      index: false,
    },
    title: data.makeAndModel.seo.title,
  };
}
