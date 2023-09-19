import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const LinksInGroups = `
  ... on ${BLOCK_PREFIX}LinksInGroups {
    fieldGroupName
    title
    description
    groups {
      title
      links {
        link {
          title
          url
          target
        }
      }
    }
    background {
      colorStop {
        color
        position
      }
    }
  }
`;
