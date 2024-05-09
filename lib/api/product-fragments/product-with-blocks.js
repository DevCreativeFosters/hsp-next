import { blocks } from '@lib/blocks';

const blocksFragments = Object.values(blocks).map(block => block('product'));

export const ProductWithBlocksFragment = /* GraphQL */ `
  fragment ProductWithBlocksFragment on Product {
    title
    slug
    productFields {
      manualsDescription
      manualPdfItems {
        manualPdf {
          node {
            mediaItemUrl
            title
          }
        }
      }
      images {
        nodes {
          mediaItemUrl
          mediaDetails {
            width
            height
          }
          altText
        }
      }
      description
      price
      installationCost
      warrantyTimePeriod
      warrantyDescription
      featuresDescription
      featuresBoxes {
        icon {
          node {
            mediaItemUrl
            mediaDetails {
              width
              height
            }
          }
        }
        title
        content
        video {
          node {
            mediaItemUrl
            mediaDetails {
              width
              height
            }
          }
        }
        image {
          node {
            mediaItemUrl
            mediaDetails {
              width
              height
            }
          }
        }
      }
      specificationDescription
      specification
      variants {
        sku
        parentInherit
        variantName
        variantSlug
        uteBuilderImages {
          imageDesktop {
            node {
              sourceUrl
            }
          }
        }
        variantDetails {
          images {
            nodes {
              mediaItemUrl
              mediaDetails {
                width
                height
              }
              altText
            }
          }
          description
          price
          installationCost
          warrantyTimePeriod
          warrantyDescription
          featuresDescription
          featuresBoxes {
            icon {
              node {
                mediaItemUrl
                mediaDetails {
                  width
                  height
                }
              }
            }
            title
            content
            video {
              node {
                mediaItemUrl
                mediaDetails {
                  width
                  height
                }
              }
            }
            image {
              node {
                mediaItemUrl
                mediaDetails {
                  width
                  height
                }
              }
            }
          }
          specificationDescription
          specification
          manualsDescription
          manualPdfItems {
            manualPdf {
              node {
                mediaItemUrl
                title
              }
            }
          }
        }
      }
    }
    flexibleContent {
      blocks {
        ... on FlexibleContentBlocksAccreditationsLayout {
          fieldGroupName
          title
          text
          certificates {
            certificateName
            image {
              node {
                altText
                sourceUrl
              }
            }
          }
          membershipsGroup {
            text
            title
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksCategoriesAndProductsLayout {
          fieldGroupName
          links {
            link {
              title
              url
            }
            product {
              productTitle
              productPrice
              productImage {
                node {
                  altText
                  sourceUrl
                }
              }
              imageCoverContain
              productLink {
                url
              }
            }
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksChooseYourVehicleLayout {
          fieldGroupName
        }
        ... on FlexibleContentBlocksFaqLayout {
          fieldGroupName
          title
          description
          buttons {
            label
            variant
            link {
              url
            }
            withArrowForwardIcon
          }
          questions {
            answer
            question
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksFeaturesValuesLayout {
          fieldGroupName
          sectionTitle
          description
          videoFile {
            node {
              mediaItemUrl
            }
          }
          videoThumbnailImage {
            node {
              sourceUrl
            }
          }
          buttonLink {
            title
            url
          }
          attributes {
            description
            title
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksHeroLayout {
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
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksInformationCardsLayout {
          fieldGroupName
          icCards {
            size
            icon {
              node {
                altText
                sourceUrl
              }
            }
            title
            gap
            description
            backgroundImage {
              node {
                sourceUrl
                altText
                mediaDetails {
                  height
                  width
                }
              }
            }
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksInstagramFeedLayout {
          fieldGroupName
          title
          description
        }
        ... on FlexibleContentBlocksIntroAndCardsLayout {
          fieldGroupName
          title
          description
          cards {
            title
            description
            backgroundImage {
              node {
                sourceUrl
              }
            }
            image {
              node {
                altText
                sourceUrl
              }
            }
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksLifestyleLayout {
          fieldGroupName
          title
          description
          buttons {
            label
            variant
            link {
              url
            }
            withArrowForwardIcon
          }
          featuredPost {
            nodes {
              ... on HspTvPost {
                excerpt
                hspTvPostCustomFields {
                  description
                  videoId
                  backgroundVideo {
                    node {
                      mediaItemUrl
                    }
                  }
                }
                uri
                title
                date
                tags {
                  nodes {
                    name
                    link
                  }
                }
                featuredImage {
                  node {
                    altText
                    mediaDetails {
                      height
                      width
                    }
                    sourceUrl
                  }
                  cursor
                }
              }
            }
          }
          posts {
            nodes {
              ... on Post {
                date
                title
                excerpt
                link
                tags {
                  nodes {
                    name
                    link
                  }
                }
                featuredImage {
                  node {
                    altText
                    mediaDetails {
                      height
                      width
                    }
                    sourceUrl
                  }
                  cursor
                }
              }
              ... on HspTvPost {
                date
                title
                excerpt
                link
                tags {
                  nodes {
                    name
                    link
                  }
                }
                featuredImage {
                  node {
                    altText
                    mediaDetails {
                      height
                      width
                    }
                    sourceUrl
                  }
                  cursor
                }
              }
            }
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksLinksInGroupsLayout {
          fieldGroupName
          title
          description
          groups {
            title
            links {
              link {
                title
                url
                target
              }
            }
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksPostsCarouselLayout {
          fieldGroupName
          title
          description
          numberOfPosts
          postType
          viewAllButton {
            title
            url
            target
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksProductAddonsLayout {
          fieldGroupName
          title
          description
          productAddons {
            product {
              node {
                ... on Product {
                  id
                  slug
                  title
                  uri
                  link
                  productCategories {
                    nodes {
                      slug
                    }
                  }
                  makesAndModels {
                    nodes {
                      slug
                      name
                      taxonomyName
                      parent {
                        node {
                          name
                          slug
                        }
                      }
                    }
                  }
                  productFields {
                    price
                    variants {
                      variantSlug
                      sku
                      variantDetails {
                        price
                      }
                    }
                  }
                  featuredImage {
                    node {
                      altText
                      sourceUrl
                      mediaDetails {
                        height
                        width
                      }
                    }
                  }
                }
              }
            }
          }
        }
        ... on FlexibleContentBlocksProductGridLayout {
          fieldGroupName
          title
          products {
            link {
              url
            }
            productImage {
              node {
                mediaItemUrl
              }
            }
            title
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksProductTilesLayout {
          fieldGroupName
          title
          allProductsLink {
            title
            url
          }
          products {
            title
            startingPrice
            link {
              url
            }
            productImage {
              node {
                sourceUrl
              }
            }
          }
        }
        ... on FlexibleContentBlocksPromoImageAndTextLayout {
          fieldGroupName
          title
          description
          image {
            node {
              altText
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
        ... on FlexibleContentBlocksPromoTextAndVideoLayout {
          fieldGroupName
          title
          description
          learnMoreButton {
            title
            url
          }
          videoFile {
            node {
              mediaItemUrl
            }
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksPromoWith2VideosLayout {
          fieldGroupName
          sectionTitle
          description
          buttonLink {
            title
            url
          }
          accessories {
            accessoryName
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
        ... on FlexibleContentBlocksReviewsLayout {
          fieldGroupName
          inheritFromMainCategory
          title
          description
          allReviewsLink {
            link {
              title
              url
            }
          }
          reviews {
            score
            reviewText
            reviewerName
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksShortcodeLayout {
          fieldGroupName
          shortcode
        }
        ... on FlexibleContentBlocksSidebarLinkGroupLayout {
          fieldGroupName
          title
          links {
            link {
              title
              url
            }
          }
        }
        ... on FlexibleContentBlocksTilesLayout {
          fieldGroupName
          title
          description
          buttons {
            label
            variant
            link {
              url
            }
            withArrowForwardIcon
          }
          tiles {
            image {
              node {
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
              }
            }
            title
            content
            link {
              url
              target
            }
            tags {
              nodes {
                name
                link
              }
            }
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksTitleAndDescriptionLayout {
          fieldGroupName
          layoutVariant
          title
          description
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksVideoBackgroundHeroLayout {
          backgroundFile {
            node {
              mediaItemUrl
            }
          }
          description
          fieldGroupName
          title
          link {
            title
            url
          }
        }
        ... on FlexibleContentBlocksVideoCarouselLayout {
          fieldGroupName
          description
          title
          button {
            title
            url
          }
          hspCelebrityPosts {
            nodes {
              ... on Celebrity {
                id
                title
                slug
                celebrityPostsCustomFields {
                  thumbnail {
                    node {
                      altText
                      sourceUrl
                    }
                  }
                  video {
                    node {
                      mediaItemUrl
                    }
                  }
                }
              }
            }
          }
        }
        ... on FlexibleContentBlocksVideoEmbedLayout {
          fieldGroupName
          embed
        }
      }
    }
  }
`;
