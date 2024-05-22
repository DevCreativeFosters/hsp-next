export default function normalizeMainMenu(menu) {
  return menu?.map(item => {
    const normalizedItem = {
      databaseId: item.databaseId,
      label: item.label,
      name: item.label.toLowerCase(),
      url: item.uri,
    };

    if (item?.childItems?.nodes?.length > 0) {
      normalizedItem.url = item.uri;
      normalizedItem.subItems = item.childItems.nodes.map(node => ({
        label: node.label,
        parentCategoryDatabaseId: node?.parentCategoryDatabaseId || null,
        url: node.uri,
      }));
    }

    return normalizedItem;
  });
}
