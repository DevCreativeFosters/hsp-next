export default function normalizeTopNavigationMenu(globalOptions) {
  return globalOptions?.menuItems?.map(item => {
    let variant = 'tertiary';
    if (item.isRequestCallbackButton === true) {
      variant = 'secondary';
    }
    if (item.isPhoneNumber === true) {
      variant = 'septenary';
    }

    return {
      icon: item.icon?.node?.sourceUrl,
      iconPredefined: item.iconPredefined,
      label: item.link?.title,
      mobileDisplay: item.displayOnMobile,
      url: item.link?.url,
      variant: variant,
    };
  });
}
