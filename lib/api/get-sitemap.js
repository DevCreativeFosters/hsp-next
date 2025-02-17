import { fetchAPI } from '@lib/fetch-api';

const query = `
  query GetSitemap {
    globalOptions {
      optionsCustomFields {
        sitemap
      }
    }
  }
`;

export async function getSitemap() {
  try {
    const data = await fetchAPI(query);
    return data?.globalOptions?.optionsCustomFields?.sitemap || null;
  } catch (error) {
    console.error('Error fetching sitemap:', error);
    return null;
  }
}
