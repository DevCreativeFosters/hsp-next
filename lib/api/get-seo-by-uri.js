import { seoFields } from '@lib/api/common/seo-fields';
import { fetchAPI } from '@lib/fetch-api';

export async function getSeoByUri(uri, tags = []) {
  const query = /* GraphQL */ `
    query getSeoData($uri: String!) {
      nodeByUri(uri: $uri) {
        ... on NodeWithTitle {
          ${seoFields}
        }
      }
    }
  `;

  const combinedTags = ['seo', ...tags];

  const data = await fetchAPI(query, {
    tags: combinedTags,
    variables: {
      uri,
    },
  });

  if (!data?.nodeByUri) return {};

  return {
    alternates: {
      canonical: data.nodeByUri.seo.canonical,
    },
    description: data.nodeByUri.seo.metaDesc,
    openGraph: {
      description: data.nodeByUri.seo.opengraphDescription,
      images: [data.nodeByUri.seo.opengraphImage?.sourceUrl],
      siteName: data.nodeByUri.seo.opengraphTitle,
      title: data.nodeByUri.seo.title,
      url: data.nodeByUri.seo.opengraphUrl,
    },
    robots: {
      follow: data.nodeByUri.seo.metaRobotsNofollow,
      index: data.nodeByUri.seo.metaRobotsNoindex,
    },
    tags: combinedTags,
    title: data.nodeByUri.seo.title,
  };
}
