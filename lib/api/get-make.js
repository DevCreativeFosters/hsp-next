import { blocks } from '@lib/blocks';
import { fetchAPI } from '@lib/fetch-api';

export async function getMake(slug) {
  const blocksFragments = Object.values(blocks).map(block => block('make'));

  const query = /* GraphQL */ `
    query getMake($id: ID!) {
      makeAndModel(id: $id, idType: SLUG) {
        databaseId
        name
        description
        slug
        detailsFields {
          details {
            productTitle
            makeTitle
            relatedProductCategory {
              nodes {
                name
                slug
              }
            }
            featuredImage {
              node {
                mediaItemUrl
                mediaDetails {
                  width
                  height
                }
              }
            }
            videoUrl
            featuresTitle
            features
            fromPrice
            warranty {
              warrantyTitle
              warrantyTimePeriod
              warrantyDescription
            }
            flexibleContentBlocks {
              blocks {${blocksFragments}}
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    tags: [`make-and-model:${slug}`],
    variables: {
      id: slug,
    },
  });

  return data?.makeAndModel || {};
}
