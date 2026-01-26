import { fetchAPI } from '@lib/fetch-api';

import { StoreFragment } from './store-fragments/store-fragment';

export const query = `
  ${StoreFragment}
  query GetStoreBySlug($slug: ID!) {
    store(id: $slug, idType: SLUG) {
      ...StoreFragment
    }
  }
`;

export async function getStoreBySlug(slug) {
  const data = await fetchAPI(query, {
    tags: ['store'],
    variables: { slug },
  });

  return data?.store || null;
}
