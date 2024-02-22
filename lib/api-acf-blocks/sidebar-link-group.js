import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const SidebarLinkGroup = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}SidebarLinkGroup${blockSuffix} {
      fieldGroupName
      title
      links {
        link {
          title
          url
        }
      }
    }
  `;
};
