import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const SidebarLinkGroup = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}SidebarLinkGroup${blockSuffix} {
      fieldGroupName
      title
      titleTag
      titleTagStyle
      links {
        link {
          title
          url
        }
      }
    }
  `;
};
