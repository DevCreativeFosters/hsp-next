export default function normalizeMobileMenu(menu) {
  return menu?.map(menuItem => ({
    url: menuItem.uri,
    label: menuItem.label,
    subItems:
      menuItem.childItems?.nodes?.map(childItem => ({
        url: childItem.uri,
        label: childItem.label,
        special: childItem.label.toLowerCase() === 'view all support',
      })) || [],
  }));
}
