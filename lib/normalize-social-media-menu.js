export default function normalizeSocialMediaMenu(globalOptions) {
  return globalOptions?.socialMediaLinks?.map(item => {
    return {
      url: item.socialMediaLink,
      icon: item.socialMediaIcon?.node?.sourceUrl,
      iconPredefined: item.socialMediaIconPredefined[0],
    };
  });
}
