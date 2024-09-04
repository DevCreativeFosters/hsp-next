import { fetchAPI } from '@lib/fetch-api';

export async function getModelsByMakeSlug(makeSlug) {
  const query = /* GraphQL */ `
    query getModelsByMakeSlug($id: ID!) {
      makeAndModel(id: $id, idType: SLUG) {
        children {
          nodes {
            databaseId
            name
            slug
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    tags: [`make-and-model:${makeSlug}`],
    variables: {
      id: makeSlug,
    },
  });

  return data?.makeAndModel?.children?.nodes || [];
}
