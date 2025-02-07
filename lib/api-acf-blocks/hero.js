import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const Hero = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}Hero${blockSuffix} {
      fieldGroupName
      heroSlides: heroSlide {
        title
        titleTag
        titleTagStyle
        description
        buttonLink {
          title
          url
          target
        }
        backgroundImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        backgroundImagePosition
        backgroundImageMobile {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        backgroundImagePositionMobile
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
