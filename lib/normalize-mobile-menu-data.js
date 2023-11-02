function extractMostNestedItems(nodes) {
  let subItems = [];
  nodes.forEach(node => {
    if (node.childItems?.nodes?.length > 0) {
      subItems = extractMostNestedItems(node.childItems.nodes);
    } else {
      subItems.push({
        url: node.uri,
        label: node.label,
      });
    }
  });
  return subItems.filter(item => !item?.url?.includes('/product_category/'));
}

export default function normalizeMenuData(data) {
  const productsNode = data.find(item => item.label === 'Products');

  let subItems = [];
  if (productsNode?.childItems?.nodes?.length > 0) {
    subItems = extractMostNestedItems(productsNode.childItems.nodes);
  }

  const normalizedData = data
    .map(item => {
      const result = {
        name: item.label.toLowerCase(),
        label: item.label,
        url: '',
        subItems: [],
      };

      if (item.label === 'Products' && subItems.length > 0) {
        result.subItems = [
          {
            url: item.uri,
            label: `View all Products`,
            special: true,
          },
          ...subItems,
        ];
      } else if (item.label === 'Products') {
        result.url = item.uri;
      } else if (item.childItems?.nodes?.length > 0) {
        result.subItems = [
          {
            url: item.uri,
            label: `View all ${item.label}`,
            special: true,
          },
          ...extractMostNestedItems(item.childItems.nodes),
        ];
      } else {
        result.url = item.uri;
      }

      return result;
    })
    .filter(item => item.subItems?.length > 0 || item.label !== 'Products');

  return normalizedData;
}
