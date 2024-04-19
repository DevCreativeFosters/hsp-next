import { fetchAPI } from '@lib/fetch-api';

export async function getMenu(menuId) {
  const query = /* GraphQL */ `
    query getMenu($menuId: ID!) {
      menu(idType: SLUG, id: $menuId) {
        menuItems(first: 50) {
          nodes {
            label
            uri
            id
            childItems {
              nodes {
                label
                uri
                id
                childItems {
                  nodes {
                    label
                    uri
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      menuId,
    },
  });

  const removeDuplicates = (menuItems, parentIds = new Set()) => {
    const uniqueItems = [];
    menuItems.forEach(item => {
      if (!parentIds.has(item.id)) {
        parentIds.add(item.id);
        const newItem = {
          childItems: {
            nodes: removeDuplicates(item.childItems?.nodes || [], parentIds),
          },
          id: item.id,
          label: item.label,
          uri: item.uri,
        };
        uniqueItems.push(newItem);
      }
    });
    return uniqueItems;
  };

  if (data?.menu?.menuItems?.nodes) {
    data.menu.menuItems.nodes = removeDuplicates(data.menu.menuItems.nodes);
    return data.menu.menuItems.nodes;
  }

  return [];
}
