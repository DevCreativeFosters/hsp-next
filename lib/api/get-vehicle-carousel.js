import { fetchAPI } from '@lib/fetch-api';

// The "Vehicle flexible content" (Title / Description / Image carousel) lives on
// the Make_and_model (vehicle) entity, keyed by the model slug. Used on product
// detail pages (/[category]/[make]/[model]).
const VEHICLE_CAROUSEL_QUERY = `
  query VehicleCarousel($slug: ID!) {
    makeAndModel(id: $slug, idType: SLUG) {
      carouselFlexibleContentBlock {
        block {
          __typename
          ... on CarouselFlexibleContentBlockBlockTitleLayout {
            description
          }
          ... on CarouselFlexibleContentBlockBlockDescriptionLayout {
            description
          }
          ... on CarouselFlexibleContentBlockBlockImageCarouselLayout {
            image {
              nodes {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export async function getVehicleCarousel(slug) {
  if (!slug) return null;

  try {
    const data = await fetchAPI(VEHICLE_CAROUSEL_QUERY, {
      tags: ['make_and_model'],
      variables: { slug },
    });

    return data?.makeAndModel?.carouselFlexibleContentBlock?.block || null;
  } catch (e) {
    console.error('Error fetching vehicle carousel:', e);
    return null;
  }
}
