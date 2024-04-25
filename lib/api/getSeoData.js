import { fetchAPI } from '@lib/fetch-api';

export async function getSeoData(uri) {
  const query = /* GraphQL */ `
    query getSeoData($uri: String!) {
      nodeByUri(uri: $uri) {
        ... on NodeWithTitle {
          seo {
            canonical
            title
            metaDesc
            focuskw
            metaRobotsNoindex
            metaRobotsNofollow
            opengraphDescription
            opengraphTitle
            opengraphDescription
            opengraphImage {
              altText
              sourceUrl
              srcSet
            }
            opengraphUrl
            opengraphSiteName
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      uri,
    },
  });

  if (!data.nodeByUri) return {};

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
