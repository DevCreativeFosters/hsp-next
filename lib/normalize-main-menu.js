export default function normalizeMainMenu(menu) {
  return menu?.map(item => {
    const normalizedItem = {
      databaseId: item.databaseId,
      image: item.image,
      label: item.label,
      name: item.label.toLowerCase(),
      url: item.uri,
    };

    if (item?.childItems?.nodes?.length > 0) {
      normalizedItem.url = item.uri;
      normalizedItem.subItems = item.childItems.nodes.map(node => {
        const item = {
          image: node.image,
          label: node.label,
          parentCategoryDatabaseId: node?.parentCategoryDatabaseId || null,
          url: node.uri,
        };

        if (node?.childItems?.nodes?.length > 0) {
          item.url = node.uri;
          item.subItems = node.childItems.nodes.map(childNode => {
            return {
              image: childNode.image,
              label: childNode.label,
              url: childNode.uri,
            };
          });
        }

        return item;
      });
    }

    return normalizedItem;
  });
}
