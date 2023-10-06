import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const SidebarLinkGroup = `
  ... on ${BLOCK_PREFIX}SidebarLinkGroup {
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
