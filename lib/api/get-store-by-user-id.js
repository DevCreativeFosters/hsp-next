import { fetchAPI } from '@lib/fetch-api';
import normalizeStores from '@lib/normalize-stores';

import { StoreFragment } from './store-fragments/store-fragment';

export const query = `
  ${StoreFragment}
  query GetStoreByUserId($userId: Int!) {
    stores(where: { assignedB2bUser: $userId }, first: 1) {
      nodes {
        ...StoreFragment
      }
    }
  }
`;

export async function getStoreByUserId(userId) {
  const data = await fetchAPI(query, {
    tags: ['store'],
    variables: { userId },
  });

  if (data?.stores?.nodes?.length == 1) {
    return normalizeStores(data?.stores?.nodes)[0] || null;
  }

  return null;
}
