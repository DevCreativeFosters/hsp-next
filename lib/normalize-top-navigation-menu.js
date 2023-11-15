export default function normalizeTopNavigationMenu(globalOptions) {
  return globalOptions?.menuItems?.map(item => {
    let variant = 'tertiary';
    if (item.isRequestCallbackButton === true) {
      variant = 'secondary';
    }

    return {
      url: item.link?.url,
      label: item.link?.title,
      icon: item.icon?.sourceUrl,
      iconPredefined: item.iconPredefined,
      variant: variant,
    };
  });
}
