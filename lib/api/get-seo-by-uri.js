import { seoFields } from '@lib/api/common/seo-fields';
import { fetchAPI } from '@lib/fetch-api';

export async function getSeoByUri(uri) {
  const query = /* GraphQL */ `
    query getSeoData($uri: String!) {
      nodeByUri(uri: $uri) {
        ... on NodeWithTitle {
          ${seoFields}
        }
        ... on ContentNode {
          contentType {
            node {
              name
            }
          }
        }
      }
    }
  `;

  const slugParts = uri.split('/').filter(Boolean);
  let tags = [];

  const data = await fetchAPI(query, {
    tags: tags,
    variables: {
      uri,
    },
  });

  if (!data?.nodeByUri) return {};

  const type = data.nodeByUri.contentType?.node?.name || 'page';

  tags = [
    'seo',
    ...slugParts.map((_, index) => {
      const partialSlug = slugParts.slice(0, index + 1).join('/');
      return `${type}:${partialSlug}`;
    }),
  ];

  return {
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
    title: data.nodeByUri.seo.title,
  };
}
