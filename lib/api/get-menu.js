import { fetchAPI } from '@lib/fetch-api';

export const query = `
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
            connectedNode {
              node {
                databaseId
              }
            }
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
`;

export const removeDuplicates = (menuItems, parentIds = new Set()) => {
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
        parentCategoryDatabaseId: item.connectedNode?.node?.databaseId || null,
        uri: item.uri,
      };
      uniqueItems.push(newItem);
    }
  });
  return uniqueItems;
};

export async function getMenu(menuId) {
  const data = await fetchAPI(`query getMenu($menuId: ID!) { ${query} }`, {
    variables: {
      menuId,
    },
  });
  return getResult(data);
}

export function getResult(data, key = 'menu') {
  let nodes = data?.[key]?.menuItems?.nodes;
  return nodes ? removeDuplicates(nodes) : [];
}
