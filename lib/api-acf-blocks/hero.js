import { BLOCK_PREFIX } from './_block-prefix';

export const Hero = `
  ... on ${BLOCK_PREFIX}Hero {
    fieldGroupName
    heroSlides: heroSlide {
      title
      description
      buttonLink {
        title
        url
      }
      backgroundImage {
        sourceUrl
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
