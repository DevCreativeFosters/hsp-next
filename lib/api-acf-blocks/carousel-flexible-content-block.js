import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const CarouselFlexibleContentBlock = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}CarouselFlexibleContentBlock${blockSuffix} {
      fieldGroupName
      title
      description
      imageCarousel {
        nodes {
          sourceUrl
          altText
        }
      }
    }
  `;
};
