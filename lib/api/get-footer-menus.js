import { fetchAPI } from '@lib/fetch-api';

export async function getFooterMenus() {
  const query = /* GraphQL */ `
    query getFooterMenus {
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
    }
  `;

  const data = await fetchAPI(query);

  return data?.menus?.edges;
}
