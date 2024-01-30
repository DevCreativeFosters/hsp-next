import axios from 'axios';

import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';
import { Hero } from '@lib/api-acf-blocks/hero';
import { PromoWith2Videos } from '@lib/api-acf-blocks/promo-with-2-videos';
import { PromoTextAndVideo } from '@lib/api-acf-blocks/promo-text-and-video';
import { PromoImageAndText } from '@lib/api-acf-blocks/promo-image-and-text';
import { ProductTiles } from '@lib/api-acf-blocks/product-tiles';
import { CategoriesAndProducts } from '@lib/api-acf-blocks/categories-and-products';
import { Reviews } from '@lib/api-acf-blocks/reviews';
import { FeaturesValues } from '@lib/api-acf-blocks/features-values';
import { Lifestyle } from '@lib/api-acf-blocks/lifestyle';
import { Tiles } from '@lib/api-acf-blocks/tiles';
import { Faq } from '@lib/api-acf-blocks/faq';
import { IntroAndCards } from '@lib/api-acf-blocks/intro-and-cards';
import { Accreditations } from '@lib/api-acf-blocks/accreditations';
import { VideoBackgroundHero } from '@lib/api-acf-blocks/video-background-hero';
import { InformationCards } from '@lib/api-acf-blocks/information-cards';
import { LinksInGroups } from '@lib/api-acf-blocks/links-in-groups';
import { PostsCarousel } from '@lib/api-acf-blocks/posts-carousel';
import { TitleAndDescription } from '@lib/api-acf-blocks/title-and-description';
import { SidebarLinkGroup } from '@lib/api-acf-blocks/sidebar-link-group';
import { VideoCarousel } from '@lib/api-acf-blocks/video-carousel';
import { Shortcode } from '@lib/api-acf-blocks/shortcode';
import { ProductGrid } from '@lib/api-acf-blocks/product-grid';

const blocks = {
  Hero,
  PromoWith2Videos,
  PromoTextAndVideo,
  PromoImageAndText,
  ProductTiles,
  CategoriesAndProducts,
  Reviews,
  FeaturesValues,
  Lifestyle,
  Tiles,
  Faq,
  IntroAndCards,
  Accreditations,
  VideoBackgroundHero,
  InformationCards,
  LinksInGroups,
  PostsCarousel,
  TitleAndDescription,
  SidebarLinkGroup,
  VideoCarousel,
  Shortcode,
  ProductGrid,
};

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const BREVO_SIGNUP_URL = process.env.NEXT_PUBLIC_BREVO_SIGNUP_URL;

export async function fetchAPI(
  query = '',
  { variables } = {},
  endpoint = API_URL,
) {
  const headers = { 'Content-Type': 'application/json' };

  if (!endpoint) {
    throw new Error('API_URL is not defined');
  }

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] =
      `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const res = await axios(endpoint, {
    headers,
    method: 'POST',
    data: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 30 },
  });
  let json;
  try {
    // json = await res.json();
    json = res.data;
  } catch (err) {
    console.error('ERR', err);
  }

  if (json?.errors) {
    //console.debug(query);
    //console.error(json.errors);
    throw new Error('Failed to fetch API' + query);
  }
  return json?.data;
}

export async function getAllPosts() {
  const data = await fetchAPI(`
    query AllPosts {
      posts(first: 10000) {
        edges {
          node {
            id
            slug
            title
          }
        }
      }
    }
  `);

  return data?.posts;
}

export async function getPageBlockNames(slug) {
  const blockPrefix = getBlockPrefix();
  const data = await fetchAPI(
    `
    query pageBlocks($id: ID!) {
      page(id: $id, idType: URI) {
        flexibleContent {
          blocks {${Object.keys(blocks)
            .map(
              name => `
            ... on ${blockPrefix}${name} {
              fieldGroupName
            }`,
            )
            .join('')}
          }
        }
      }
    }
  `,
    {
      variables: {
        id: '/' + slug,
      },
    },
  );

  return data?.page?.flexibleContent?.blocks
    .map(b => b?.fieldGroupName?.split?.(blockPrefix)?.[1])
    .filter(Boolean);
}

export async function getPageData(slug) {
  const blocksOrdered = (await getPageBlockNames(slug)) || [];
  const blocksFragments = blocksOrdered.map(blockName => blocks[blockName]());

  const data = await fetchAPI(
    `
    query getPageData($id: ID!) {
      page(id: $id, idType: URI) {
        title
        content
        ${
          blocksFragments.length > 0
            ? `flexibleContent {
            blocks {
              ${blocksFragments}
            }
        }`
            : ''
        }
      }
    }
  `,
    {
      variables: {
        id: '/' + slug,
      },
    },
  );

  return data.page;
}

export async function getLatestNumberOfBlogPosts(number) {
  const data = await fetchAPI(`
    query getLatestNumberOfBlogPosts {
      posts(first: ${number}) {
        nodes {
          title
          slug
          uri
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
            }
          }
          tags {
            nodes {
              name
            }
          }
        }
      }
    }
  `);

  return data;
}

export async function getLatestNumberOfHSPTVPosts(number) {
  const data = await fetchAPI(`
    query getLatestNumberOfHSPTVPosts {
      hspTvPosts(first: ${number}) {
        nodes {
          title
          slug
          uri
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          tags {
            nodes {
              name
            }
          }
        }
      }
    }
  `);

  return data;
}

export async function getLatestNumberOfHSPCelebritiesPosts(number) {
  const condition = Boolean(number) ? `(first: ${number})` : '';
  const data = await fetchAPI(`
    query getLatestNumberOfHSPCelebritiesPosts {
      celebrities${condition} {
        nodes {
          title
          id
          slug
          celebrityPostsCustomFields {
            thumbnail {
              altText
              sourceUrl
            }
            video {
              mediaItemUrl
            }
          }
        }
      }
    }
  `);

  return data;
}

export async function getFooterMenus() {
  const data = await fetchAPI(`
  {
    menus {
      edges {
        node {
          id
          name
          locations
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
    }
  }
`);

  return data?.menus?.edges;
}

export async function getGlobalOptions() {
  const data = await fetchAPI(`
    query GlobalOptions {
      globalOptions {
        optionsCustomFields {
          footerText
          menuItems {
            isRequestCallbackButton
            isPhoneNumber
            displayOnMobile
            link {
              url
              title
            }
            icon {
              sourceUrl
            }
            iconPredefined
          }
          socialMediaLinks {
            socialMediaIconPredefined
            socialMediaIcon {
              sourceUrl
            }
            socialMediaLink
          }
          featuredPost {
            ... on HspTvPost {
              excerpt
              hspTvPostCustomFields {
                description
                videoId
                backgroundVideo {
                  mediaItemUrl
                }
              }
              uri
              slug
              title
              date
              tags {
                nodes {
                  name
                }
              }
            }
          }
          contactUsInfo
          servicesBox {
            link {
              title
              url
              target
            }
          }
          enquiryFormId
          downloadFileFormId
        }
      }
    }
  `);

  if (data) {
    return data.globalOptions?.optionsCustomFields;
  } else {
    return null;
  }
}

export async function getAllBlogPosts(numberOfPosts) {
  const data = await fetchAPI(
    `
    query GetBlogPosts {
      posts(first: ${numberOfPosts}) {
        nodes {
          date
          featuredImage {
            node {
              sourceUrl
              altText
              title
              mediaDetails {
                width
                height
              }
            }
          }
          id
          uri
          title
          excerpt
          tags {
            nodes {
              name
            }
          }
        }
      }
    }
  `,
  );

  return data;
}

export async function getAllHspTvPosts(numberOfPosts) {
  const data = await fetchAPI(
    `
    query GetHspTVPosts($numberOfPosts: Int!) {
      hspTvPosts(first: $numberOfPosts) {
        nodes {
          date
          featuredImage {
            node {
              sourceUrl
              altText
              title
              mediaDetails {
                width
                height
              }
            }
          }
          id
          uri
          title
          excerpt
          tags {
            nodes {
              name
            }
          }
        }
      }
    }
    `,
    {
      variables: {
        numberOfPosts: numberOfPosts,
      },
    },
  );

  return data;
}

export async function getBlogPosts(numberOfPosts) {
  const data = await fetchAPI(`
    query blogPosts {
      posts(last: ${numberOfPosts}) {
        nodes {
          title
          uri
        }
      }
    }
  `);

  return data?.posts?.nodes;
}

export async function getBlogPost(slug) {
  const data = await fetchAPI(`
    query blogPost {
      postBy(slug: "${slug}") {
        content
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
        excerpt
        title
        uri
      }
    }
  `);

  return data?.postBy;
}

export async function getGravityForm(id) {
  const data = await fetchAPI(
    `
    query GravityForm($id: ID!) {
      gfForm(id: $id, idType: DATABASE_ID) {
        cssClass
        databaseId
        dateCreated
        title
        description
        formId
        formFields {
          nodes {
            layoutGridColumnSpan
            databaseId
            type
            ... on PhoneField {
              id
              label
              cssClass
              description
              isRequired
              placeholder
            }
            ... on EmailField {
              id
              label
              cssClass
              description
              isRequired
              placeholder
            }
            ... on TextField {
              id
              label
              cssClass
              description
              isRequired
              placeholder
            }
            ... on TextAreaField {
              id
              label
              cssClass
              description
              isRequired
              placeholder
            }
            ... on HtmlField {
              databaseId
              label
              cssClass
              content
            }
            ... on RadioField {
              databaseId
              label
              cssClass
              isRequired
              choices {
                text
                value
              }
            }
            ... on HiddenField {
              databaseId
              label
              canPrepopulate
              inputName
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        id: id,
      },
    },
  );

  return data;
}

export async function sendGravityForm(input) {
  const data = await fetchAPI(
    `
      mutation ($input: SubmitGfFormInput!) {
        submitGfForm(input: $input) {
          confirmation {
            type
            message
            url
          }
          errors {
            id
            message
          }
        }
      }
    `,
    {
      variables: {
        input: input,
      },
    },
  );

  return data;
}

export async function getAllStores() {
  const data = await fetchAPI(
    `query getAllStores {
      stores(first: 10000) {
        nodes {
          storesCustomFields {
            addressFields {
              streetAddress
              city
              twCity
              zipCode
              myState
              nzState
              state
              country
            }
            directionsLink
            phoneNumber
            storeLocationCoordinates {
              latitude
              longitude
            }
            storeType
          }
        }
      }
    }
  `,
  );

  return data;
}

export async function getPageGutenbergContent(slug) {
  const data = await fetchAPI(
    `
      query ($slug: String!) {
        pageBy(uri: $slug) {
          title
          content
        }
      }
    `,
    {
      variables: {
        slug: slug,
      },
    },
  );

  return data?.pageBy;
}
export async function getMainProductCategories() {
  try {
    const data = await fetchAPI(
      `
        query getMainProductCategories {
          productCategories(where: {parent: null}, first: 1000) {
            nodes {
              databaseId
              id
              name
              description
              children(first: 1000) {
                nodes {
                  databaseId
                  id
                  name
                  slug
                  parent {
                    node {
                      id
                    }
                  }
                  mainCategoryDetails {
                    featuredImage {
                      sourceUrl
                      mediaDetails {
                        width
                        height
                      }
                    }
                    fromPrice
                    productImage {
                      mediaItemUrl
                      mediaDetails {
                        width
                        height
                      }
                    }
                    videoUrl
                    features
                    fromPrice
                    warranty {
                      warrantyTimePeriod
                      warrantyDescription
                    }
                  }
                }
              }
            }
          }
        }
      `,
    );

    return data?.productCategories?.nodes;
  } catch {
    return null;
  }
}

export async function getMainProductCategoryBlocks(slug) {
  const blocksFragments = Object.values(blocks).map(block =>
    block('product_category'),
  );

  const data = await fetchAPI(
    `
      query getMainProductBlocksCategory($id: ID!) {
        productCategory(id: $id, idType: SLUG) {
          flexibleContent {
            blocks {
              ${blocksFragments}
            }
          }
        }
      }
    `,
    {
      variables: {
        id: slug,
      },
    },
  );

  return data?.productCategory;
}

export async function getMainProductCategory(slug) {
  const data = await fetchAPI(
    `
      query getMainProductCategory($id: ID!) {
        productCategory(id: $id, idType: SLUG) {
          databaseId
          name
          description
          categoryRelations {
            availableMakes {
              databaseId
              name
              slug
            }
          }
          mainCategoryDetails {
            featuredImage {
              mediaItemUrl
              mediaDetails {
                width
                height
              }
            }
            videoUrl
            features
            fromPrice
            warranty {
              warrantyTimePeriod
              warrantyDescription
            }
          }
        }
      }
    `,
    {
      variables: {
        id: slug,
      },
    },
  );

  return data.productCategory;
}

export async function getMake(slug) {
  const data = await fetchAPI(
    `
      query getMake($id: ID!) {
        makeAndModel(id: $id, idType: SLUG) {
          databaseId
          name
          description
          slug
          detailsFields {
            details {
              relatedProductCategory {
                name
                slug
              }
              featuredImage {
                mediaItemUrl
                mediaDetails {
                  width
                  height
                }
              }
              videoUrl
              features
              fromPrice
              warranty {
                warrantyTimePeriod
                warrantyDescription
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        id: slug,
      },
    },
  );

  return data.makeAndModel;
}

export async function getAllMakes() {
  const data = await fetchAPI(
    `
      query getMakes {
        makesAndModels(where: {parent: null}, first: 100) {
          nodes {
            databaseId
            name
            slug
            children {
              nodes {
                name
                slug
                databaseId
              }
            }
          }
        }
      }
    `,
  );

  const makes = data.makesAndModels?.nodes;

  return makes.map(make => {
    return {
      name: make.name,
      slug: make.slug,
      models: make.children.nodes.map(({ name, slug }) => {
        return {
          name,
          slug,
        };
      }),
    };
  });
}

export async function getModelsByMakeSlug(makeSlug) {
  const data = await fetchAPI(
    `
      query getModels($id: ID!) {
        makeAndModel(id: $id, idType: SLUG) {
          children {
            nodes {
              databaseId
              name
              slug
            }
          }
        }
      }
    `,
    {
      variables: {
        id: makeSlug,
      },
    },
  );

  return data.makeAndModel?.children?.nodes;
}

export async function getProductsByCategoriesSlugs(
  mainCategorySlug,
  makeSlug,
  modelSlug,
) {
  const blocksFragments = Object.values(blocks).map(block => block('product'));

  const data = await fetchAPI(
    `
      query getProductsByCategories(
        $mainCategorySlug: [String]!
        $makeSlug: [String]!
        $modelSlug: [String]!
      ) {
        products(
          where: {
            mainCategorySlug: $mainCategorySlug
            makeSlug: $makeSlug
            modelSlug: $modelSlug
          }
        ) {
          nodes {
            title
            slug
            productFields {
              manualsDescription
              manualPdfItems {
                manualPdf {
                  mediaItemUrl
                  title
                }
              }
              images {
                image {
                  mediaItemUrl
                  mediaDetails {
                    width
                    height
                  }
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
                  mediaItemUrl
                  mediaDetails {
                    width
                    height
                  }
                }
                title
                content
                video {
                  mediaItemUrl
                  mediaDetails {
                    width
                    height
                  }
                }
                image {
                  mediaItemUrl
                  mediaDetails {
                    width
                    height
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
                    sourceUrl
                  }
                }
                variantDetails {
                  price
                }
              }
            }
            flexibleContent {
              blocks {
                ${blocksFragments}
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        mainCategorySlug: mainCategorySlug,
        makeSlug: makeSlug,
        modelSlug: modelSlug,
      },
    },
  );

  return data.products?.nodes;
}

export async function getMenu(menuId) {
  const data = await fetchAPI(
    `
    query getMenu($menuId: ID!) {
      menu(idType: SLUG, id: $menuId) {
        menuItems(first: 50) {
          nodes {
            label
            uri
            id
            childItems {
              nodes {
                label
                uri
                id
                childItems {
                  nodes {
                    label
                    uri
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
    `,
    {
      variables: {
        menuId: menuId,
      },
    },
  );

  function removeDuplicates(menuItems, parentIds = new Set()) {
    const uniqueItems = [];
    menuItems.forEach(item => {
      if (!parentIds.has(item.id)) {
        parentIds.add(item.id);
        const newItem = {
          id: item.id,
          label: item.label,
          uri: item.uri,
          childItems: {
            nodes: removeDuplicates(item.childItems?.nodes || [], parentIds),
          },
        };
        uniqueItems.push(newItem);
      }
    });
    return uniqueItems;
  }

  if (data?.menu?.menuItems?.nodes) {
    data.menu.menuItems.nodes = removeDuplicates(data.menu.menuItems.nodes);
    return data.menu.menuItems.nodes;
  }

  return [];
}

export async function getProductCategories() {
  const data = await fetchAPI(
    `
      query getProductCategories {
        productCategories {
          nodes {
            name
            slug
            id
          }
        }
      }
    `,
  );

  return data?.productCategories?.nodes;
}

export async function getMenuDropdownProducts() {
  const data = await fetchAPI(
    `
      query getProducts {
        products {
          nodes {
            title
            featuredImage {
              node {
                sourceUrl
              }
            }
            productId
            slug
            productCategories {
              nodes {
                name
                id
                slug
              }
            }
          }
        }
      }
    `,
  );

  return data?.products?.nodes;
}

export async function getHspTvPosts(numberOfPosts) {
  const data = await fetchAPI(
    `
    query hspTvPosts($numberOfPosts: Int!) {
      hspTvPosts(last: $numberOfPosts) {
        nodes {
          title
          uri
        }
      }
    }
  `,
    {
      variables: {
        numberOfPosts: numberOfPosts,
      },
    },
  );

  return data?.hspTvPosts?.nodes;
}

export async function getHspTvPost(slug) {
  const data = await fetchAPI(`
    query hspTvPost {
      hspTvPostBy(slug: "${slug}") {
        title
        content
        hspTvPostCustomFields {
          description
          videoId
          backgroundVideo {
            mediaItemUrl
          }
        }
      }
    }
  `);

  return data?.hspTvPostBy;
}

export async function getCategoriesAndMakesAndModels() {
  const data = await fetchAPI(
    `
      query getProductBreadcrumbs {
        products {
          nodes {
            makesAndModels {
              nodes {
                name
                slug
                children {
                  nodes {
                    name
                    slug
                  }
                }
              }
            }
            productCategories {
              nodes {
                name
                slug
                parent {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    `,
  );

  return data.products.nodes;
}

export async function getModelBySlug(slug) {
  const data = await fetchAPI(
    `
      query getModelBySlug($id: ID!) {
        makeAndModel(id: $id, idType: SLUG) {
          databaseId
          name
          slug
          uteBuilderImages {
            imageDesktop {
              sourceUrl
              mediaDetails {
                width
                height
              }
            }
            imageMobile {
              sourceUrl
              mediaDetails {
                width
                height
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        id: slug,
      },
    },
  );

  return data.makeAndModel;
}

export async function getProductsWithVariants(makeSlug, modelSlug) {
  const data = await fetchAPI(
    `
      query getProductsWithVariants($makeSlug: [String]!, $modelSlug: [String]!) {
        products(where: { makeSlug: $makeSlug, modelSlug: $modelSlug }) {
          nodes {
            databaseId
            title
            slug
            productFields {
              description
              price
              installationCost
              variants {
                parentInherit
                variantSlug
                variantName
                uteBuilderImages {
                  imageDesktop {
                    sourceUrl
                    mediaDetails {
                      width
                      height
                    }
                  }
                  imageMobile {
                    sourceUrl
                    mediaDetails {
                      width
                      height
                    }
                  }
                }
                variantDetails {
                  price
                }
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        makeSlug: makeSlug,
        modelSlug: modelSlug,
      },
    },
  );

  return data.products?.nodes;
}

export async function brevoNewsletterSignup(payload) {
  if (!BREVO_SIGNUP_URL) {
    throw new Error('BREVO_SIGNUP_URL is not defined');
  }
  const endpoint = BREVO_SIGNUP_URL + '?isAjax=1';
  try {
    const response = await axios(endpoint, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      data: payload,
    });
    return response.data;
  } catch (err) {
    return {
      errors: err?.response?.data?.errors,
    };
  }
}

export async function getStores() {
  const data = await fetchAPI(`
    query getStores {
      stores {
        nodes {
          title
          storesCustomFields {
            addressFields {
              city
              cityTw
              country
              state
              stateMy
              stateNz
              streetAddress
              postalCode
            }
            directionsLink
            inStoreDisplays {
              productCategory {
                name
                mainCategoryDetails {
                  inStoreImage {
                    mediaItemUrl
                  }
                }
              }
            }
            learnMore {
              title
              url
            }
            phoneNumber
            productInstallationCost {
              installationCost
              product {
                ... on Product {
                  id
                }
              }
            }
            storeCategory
            storeLocationCoordinates {
              latitude
              longitude
            }
          }
        }
      }
    }
  `);

  return data?.stores?.nodes;
}
