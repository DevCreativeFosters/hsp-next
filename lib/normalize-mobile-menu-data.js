function extractMostNestedItems(nodes) {
  let subItems = [];
  nodes.forEach(node => {
    if (node.childItems?.nodes?.length > 0) {
      node.childItems.nodes.forEach(child => {
        subItems.push({
          url: child.uri.replace('product-category/', 'products/'),
          label: child.label,
        });
      });
    } else {
      subItems.push({
        url: node.uri,
        label: node.label,
      });
    }
  });
  return subItems;
}
