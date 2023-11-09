export default function normalizeMobileMenu(menu) {
  const normalizedMenu = menu?.map(menuItem => ({
    url: menuItem.childItems?.nodes?.length > 0 ? '' : menuItem.uri,
    label: menuItem.label,
    subItems:
      menuItem.childItems?.nodes?.map(childItem => ({
        url: childItem.uri,
        label: childItem.label,
        subItems: childItem.childItems.nodes?.map(node => ({
          url: node.uri,
          label: node.label,
        })),
        special: childItem.childItems.nodes?.length > 0 ? false : true,
      })) || [],
  }));

  return normalizedMenu;
}
