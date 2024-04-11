export default function normalizeMobileMenu(menu) {
  const normalizedMenu = menu?.map(menuItem => ({
    label: menuItem.label,
    subItems:
      menuItem.childItems?.nodes?.map(childItem => ({
        label: childItem.label,
        special: childItem.childItems.nodes?.length > 0 ? false : true,
        subItems: childItem.childItems.nodes?.map(node => ({
          label: node.label,
          url: node.uri,
        })),
        url: childItem.uri,
      })) || [],
    url: menuItem.childItems?.nodes?.length > 0 ? '' : menuItem.uri,
  }));

  return normalizedMenu;
}
