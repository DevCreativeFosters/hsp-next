import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const ColumnsFacts = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}ColumnsFacts${blockSuffix} {
      fieldGroupName
      title
      alignment
      media
        image {
          node {
            altText
            sourceUrl
          }
        }
        videoFile {
          node {
            mediaItemUrl
          }
        }
      columns {
        description
        ctaButton {
          title
          url
          target
        }
      }
    }
  `;
};
