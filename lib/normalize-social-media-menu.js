export default function normalizeSocialMediaMenu(globalOptions) {
  return globalOptions?.socialMediaLinks.map(item => {
    const iconUrl = item.socialMediaIcon.sourceUrl;
    return {
      url: item.socialMediaLink,
      icon: iconUrl,
    };
  });
}
