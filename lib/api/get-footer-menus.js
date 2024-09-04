import { fetchAPI } from '@lib/fetch-api';

export const query = `
  menus {
    edges {
      node {
        id
        name
        locations
        menuItems {
          nodes {
            id
            label
            url
          }
        }
      }
    }
  }
`;

export async function getFooterMenus() {
  const data = await fetchAPI(`{ ${query} }`, {
    tags: ['menu'],
  });

  return getResult(data);
}

export function getResult(data) {
  return data?.menus?.edges || [];
}
