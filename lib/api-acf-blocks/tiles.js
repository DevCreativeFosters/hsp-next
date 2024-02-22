import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const Tiles = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}Tiles${blockSuffix} {
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
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        title
        content
        link {
          url
          target
        }
        tags {
          nodes {
            name
            link
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
};
