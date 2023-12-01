import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const SidebarLinkGroup = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}SidebarLinkGroup {
      fieldGroupName
      title
      links {
        active
        link {
          title
          url
        }
      }
    }
  `;
};
