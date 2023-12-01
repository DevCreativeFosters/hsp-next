import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const Hero = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}Hero {
      fieldGroupName
      heroSlides: heroSlide {
        title
        description
        buttonLink {
          title
          url
          target
        }
        backgroundImage {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
        backgroundImagePosition
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
