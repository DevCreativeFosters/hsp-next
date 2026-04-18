import { fetchAPI } from '@lib/fetch-api';

export const query = `
  menuItems(first: 50) {
    nodes {
      label
      uri
      id
      primaryMenu {
        image {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
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
          primaryMenu {
            image {
              node {
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
              }
            }
          }
          childItems {
            nodes {
              label
              uri
              id
              primaryMenu {
                image {
                  node {
                    sourceUrl
                    altText
                    mediaDetails {
                      width
                      height
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function getQuery(alias = '', menuIdVariableName = 'menuId') {
  return `
    ${alias}${alias ? ':' : ''}menu(idType: SLUG, id: $${menuIdVariableName}) {
      ${query}
    }
  `;
}

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
        image: item.primaryMenu?.image,
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
  const data = await fetchAPI(`query getMenu($menuId: ID!) { ${getQuery()} }`, {
    tags: [`menu:${menuId}`],
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
