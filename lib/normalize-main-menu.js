export default function normalizeMainMenu(menu) {
  return menu?.map(item => {
    const normalizedItem = {
      name: item.label.toLowerCase(),
      label: item.label,
      url: item.uri,
    };

    if (item.childItems.nodes.length > 0) {
      normalizedItem.url = '';
      normalizedItem.subItems = [
        item.childItems.nodes.map(node => ({
          url: node.uri,
          label: node.label,
        })),
      ];
    }

    return normalizedItem;
  });
}
