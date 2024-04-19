function extractMostNestedItems(nodes) {
  let subItems = [];
  nodes.forEach(node => {
    if (node.childItems?.nodes?.length > 0) {
      node.childItems.nodes.forEach(child => {
        subItems.push({
          label: child.label,
          url: child.uri.replace('product-category/', 'products/'),
        });
      });
    } else {
      subItems.push({
        label: node.label,
        url: node.uri,
      });
    }
  });
  return subItems;
}
