import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const ClickableLogos = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}ClickableLogos${blockSuffix} {
      fieldGroupName
      title
      titleTag
      titleTagStyle
      alignment
      bodyText
      logos {
        link {
          url
          title
          target
        }
        logo {
          node {
            altText
            mediaItemUrl
            mediaDetails {
              height
              width
            }
          }
        }
      }
    }
  `;
};
