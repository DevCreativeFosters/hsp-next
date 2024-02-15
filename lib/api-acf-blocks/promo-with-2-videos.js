import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const PromoWith2Videos = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}PromoWith2Videos${blockSuffix} {
      fieldGroupName
      sectionTitle
      description
      buttonLink {
        title
        url
      }
      accessories {
        accessoryName
        price
        videoFile {
          node {
            mediaItemUrl
          }
        }
        productLink {
          url
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
