import { fetchAPI } from '@lib/fetch-api';

export async function getMainProductCategory(slug) {
  const query = /* GraphQL */ `
    query getMainProductCategory($id: ID!) {
      productCategory(id: $id, idType: SLUG) {
        databaseId
        name
        description
        mainCategoryDetails {
          title
          slogan
          featuredImage {
            node {
              altText
              mediaItemUrl
              mediaDetails {
                width
                height
              }
            }
          }
          featuredImageMobile {
            node {
              altText
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
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    tags: [`product-category:${slug}`],
    variables: {
      id: slug,
    },
  });

  return data?.productCategory || {};
}
