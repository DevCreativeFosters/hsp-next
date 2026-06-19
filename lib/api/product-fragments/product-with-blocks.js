import { blocks } from '@lib/blocks';

const blocksFragments = Object.values(blocks).map(block => block('product'));

export const ProductWithBlocksFragment = /* GraphQL */ `
  fragment ProductWithBlocksFragment on Product {
    databaseId
    title
    slug
    stockStatus
    stockQuantity
    commentCount
    comments(where: { order: DESC }, first: 10000) {
      nodes {
        id
        databaseId
        content
        rating
        date
        reviewUploadImage {
          uploadImage {
            nodes {
              sourceUrl
              link
              altText
            }
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
    acfVariants {
      variantName
      sku
      price
      stockStatus
      stockQuantity
      colorNote
      backorderNote
    }
    # ... on VariableProduct {
    #   onSale
    #   price
    #   variations(first: 50) {
    #     nodes {
    #       id
    #       databaseId
    #       name
    #       stockStatus
    #       stockQuantity
    #       price
    #       rawPrice: price(format: RAW)
    #       regularPrice
    #       salePrice
    #       onSale
    #       attributes {
    #         nodes {
    #           name
    #           label
    #           value
    #         }
    #       }
    #     }
    #   }
    # }
    # productComboDeals {
    #   applyIfCombo
    #   bundlePrice
    #   currency
    #   discountType
    #   discountValue
    #   comboProducts {
    #     edges {
    #       node {
    #         ... on Product {
    #           id
    #           databaseId
    #           title
    #           slug
    #           productFields {
    #             variants {
    #               sku
    #               variantName
    #               variantSlug
    #               variantDetails {
    #                 price
    #                 compareAtPrice
    #                 installationCost
    #                 images {
    #                   nodes {
    #                     mediaItemUrl
    #                     mediaDetails {
    #                       width
    #                       height
    #                     }
    #                     altText
    #                   }
    #                 }
    #               }
    #             }
    #             images {
    #               nodes {
    #                 mediaItemUrl
    #                 mediaDetails {
    #                   width
    #                   height
    #                 }
    #                 altText
    #               }
    #             }
    #           }
    #         }
    #       }
    #     }
    #   }
    # }
    compatibleProduct {
      selectProduct {
        product {
          nodes {
            ... on Product {
              id
              databaseId
              title
              slug
              productFields {
                variants {
                  sku
                  variantName
                  variantSlug
                  variantDetails {
                    price
                    compareAtPrice
                    installationCost
                  }
                }
              }
            }
          }
        }
        uploadProductImage {
          node {
            sourceUrl
            altText
          }
        }
        variantSku
        variantPrice
      }
    }
    giftCardSettingsFields {
      giftCardAmounts {
        amount
      }
      cardDesigns {
        nodes {
          id
          sourceUrl
          altText
          mediaItemUrl
        }
      }
    }
    productCategories {
      nodes {
        categoryRelations {
          icon {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
          imageLayerPosition
          order
        }
        name
        parent {
          node {
            id
          }
        }
        slug
        databaseId
      }
    }
    schemaProSchemas {
      type
      hash
      schema
    }
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
      freight
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
        dealName
        selectProducts {
          product {
            nodes {
              ... on Product {
                id
                databaseId
                title
                slug
                productFields {
                  variants {
                    sku
                    variantName
                    variantSlug
                    variantDetails {
                      price
                      compareAtPrice
                      installationCost
                    }
                  }
                }
              }
            }
          }
          image {
            node {
              sourceUrl
              altText
            }
          }
          variantSku
          variantPrice
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
          imageOverlay {
            node {
              altText
              sourceUrl
              mediaDetails {
                height
                width
              }
            }
          }
          description
          price
          compareAtPrice
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
        ... on FlexibleContentBlocksImageBlockLayout {
          fieldGroupName
          desktopImage {
            node {
              altText
              sourceUrl
              mediaDetails {
                height
                width
              }
            }
          }
          mobileImage {
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
        ... on FlexibleContentBlocksClickableLogosLayout {
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
        ... on FlexibleContentBlocksAccreditationsLayout {
          fieldGroupName
          title
          titleTag
          titleTagStyle
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
          titleTag
          titleTagStyle
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
          titleTag
          titleTagStyle
          description
        }
        ... on FlexibleContentBlocksIntroAndCardsLayout {
          fieldGroupName
          title
          titleTag
          titleTagStyle
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
          titleTag
          titleTagStyle
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
          titleTag
          titleTagStyle
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
          titleTag
          titleTagStyle
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
          titleTag
          titleTagStyle
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
                      name
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
                        compareAtPrice
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
          titleTag
          titleTagStyle
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
          titleTag
          titleTagStyle
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
          titleTag
          titleTagStyle
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
          titleTag
          titleTagStyle
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
          titleTag
          titleTagStyle
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
          titleTag
          titleTagStyle
          links {
            link {
              title
              url
            }
          }
        }
        ... on FlexibleContentBlocksProductMakeGridLayout {
          fieldGroupName
          title
          titleTag
          titleTagStyle
          alignment
          bodyText
          productsPerPage
          productsPerPageMobile
          productsTitleTag
          productsTitleTagStyle
          products {
            link {
              url
            }
            title
            productImage {
              node {
                mediaItemUrl
              }
            }
            startingPrice
          }
        }
        ... on FlexibleContentBlocksTilesLayout {
          fieldGroupName
          title
          titleTag
          titleTagStyle
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
          titleTag
          titleTagStyle
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
        ... on FlexibleContentBlocksFeaturePanelsLayout {
          fieldGroupName
          title
          alignment
          panels {
            label
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
            description
          }
        }
        ... on FlexibleContentBlocksAccordionFactsLayout {
          fieldGroupName
          accordionRow {
            accordionTitle
            accordionDescription
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
          }
          background {
            colorStop {
              color
              position
            }
          }
        }
        ... on FlexibleContentBlocksColumnsFactsLayout {
          fieldGroupName
          title
          titleTag
          titleTagStyle
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
        ... on FlexibleContentBlocksImageTextBoxesLayout {
          fieldGroupName
          boxes {
            layout
            title
            titleTag
            titleTagStyle
            description
            ctaButton {
              title
              url
              target
            }
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
          }
        }
      }
    }
  }
`;
