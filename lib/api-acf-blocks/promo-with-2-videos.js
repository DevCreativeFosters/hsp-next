import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const PromoWith2Videos = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}PromoWith2Videos${blockSuffix} {
      fieldGroupName
      sectionTitle
      titleTag
      titleTagStyle
      description
      buttonLink {
        title
        url
      }
      accessories {
        accessoryName
        titleTag
        titleTagStyle
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
