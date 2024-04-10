export default function normalizeSocialMediaMenu(globalOptions) {
  return globalOptions?.socialMediaLinks?.map(item => {
    return {
      icon: item.socialMediaIcon?.node?.sourceUrl,
      iconPredefined: item.socialMediaIconPredefined[0],
      url: item.socialMediaLink,
    };
  });
}
