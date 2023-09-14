import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const Tiles = `
  ... on ${BLOCK_PREFIX}Tiles {
    fieldGroupName
    title
    description
    buttons {
      label
      variant
      link {
        url
      }
      withArrowForwardIcon
    }
    tiles {
      image {
        sourceUrl
        altText,
        mediaDetails {
          width
          height
        }
      }
      title
      content
      link {
        url
      }
      tags {
        name
        link
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
