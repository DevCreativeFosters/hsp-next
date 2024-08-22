import clsx from 'clsx';
import Image from 'next/image';

import { GravityFormsStaticDataProvider } from '@contexts/gravity-forms-static-data';
import { UserProvider } from '@contexts/user';
import { VehicleProvider } from '@contexts/vehicle';

import {
  getResult as getAllMakes,
  query as makesQuery,
} from '@lib/api/get-all-makes';
import {
  query as footerMenusQuery,
  getResult as getFooterMenus,
} from '@lib/api/get-footer-menus';
import {
  getResult as getGlobalOptions,
  query as globalOptionsQuery,
} from '@lib/api/get-global-options';
import { getMainProductCategories } from '@lib/api/get-main-product-categories';
import {
  getResult as getMenu,
  getQuery as getMenuQuery,
} from '@lib/api/get-menu';
import {
  getResult as getMenuDropdownProducts,
  query as menuDropdownProductsQuery,
} from '@lib/api/get-menu-dropdown-products';
import {
  getResult as getProductCategories,
  query as productCategoriesQuery,
} from '@lib/api/get-product-categories';
import {
  getResult as getStores,
  query as storesQuery,
} from '@lib/api/get-stores';
import { ProductWithVariants } from '@lib/api/product-fragments/product-with-variants';
import { fetchAPI } from '@lib/fetch-api';
import { getExcludeTree, sortMainProductCategories } from '@lib/helpers';
import normalizeMainMenu from '@lib/normalize-main-menu';
import normalizeMobileMenu from '@lib/normalize-mobile-menu';
import normalizeProductData from '@lib/normalize-product-data';
import normalizeTopNavigationMenu from '@lib/normalize-top-navigation-menu';

import Footer from '@components/footer/footer';
import FullscreenCollapse from '@components/fullscreen-collapse/fullscreen-collapse';
import Header from '@components/header/header';
import { MODAL_PORTAL_ID } from '@components/modal/modal';
import Newsletter from '@components/newsletter/newsletter';

import BgContinent from '@assets/images/bg-continent.png';

import styles from './layout.module.scss';

const GOOGLE_RECAPTCHA_SITEKEY =
  process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITEKEY;

async function getLayoutData() {
  const bulkQuery = [
    globalOptionsQuery,
    footerMenusQuery,
    getMenuQuery('mainMenu', 'mainMenuId'),
    getMenuQuery('mobileMenu', 'mobileMenuId'),
    productCategoriesQuery,
    menuDropdownProductsQuery,
    makesQuery,
    storesQuery,
  ].join('');

  const data = await fetchAPI(
    `
      ${ProductWithVariants}
      query getBulk($mainMenuId: ID!, $mobileMenuId: ID!) { ${bulkQuery} }

      `,
    {
      variables: {
        mainMenuId: 'main-menu',
        mobileMenuId: 'mobile-navigation',
      },
    },
  );

  const globalOptions = getGlobalOptions(data);
  const footerMenus = getFooterMenus(data);
  const mainMenu = getMenu(data, 'mainMenu');
  const mobileMenu = getMenu(data, 'mobileMenu');
  const productCategories = getProductCategories(data);
  const products = getMenuDropdownProducts(data);
  const makes = getAllMakes(data);
  const allStores = getStores(data);

  const excludeTree = getExcludeTree(globalOptions);
  const excludeChildren = [globalOptions?.noCoverCategory?.nodes[0].databaseId];
  const excludeChildrenId = [globalOptions?.noCoverCategory?.nodes[0].id];

  const mainProductCategories = await getMainProductCategories(
    excludeChildren,
    excludeTree,
  );

  return {
    allStores,
    excludeChildrenId,
    footerMenus,
    globalOptions,
    mainMenu,
    mainProductCategories,
    makes,
    mobileMenu,
    productCategories,
    products,
  };
}

const data = await getLayoutData();

export default function Layout({
  children,
  reserveSpaceForVehicleSelection,
  withFooter = true,
  withMap,
}) {
  const normalizedFooterMenus = {
    hsp: [],
    legal: [],
    lifestyle: [],
    products: [],
    resources: [],
    services: [],
  };

  const footerText = data?.globalOptions?.footerText;
  const topNavigationMenu = normalizeTopNavigationMenu(data?.globalOptions);
  const normalizedMainMenu = normalizeMainMenu(data.mainMenu);
  const normalizedMobileMenu = normalizeMobileMenu(data.mobileMenu);
  const normalizedProductData = normalizeProductData(
    data.mainProductCategories,
  );
  const normalizedMainProductCategories = sortMainProductCategories(
    data.mainProductCategories,
    normalizedMainMenu,
  );
  const newsletterTitle = data?.globalOptions?.newsletterTitle;
  const newsletterDescription = data?.globalOptions?.newsletterDescription;

  data.footerMenus?.forEach(menu => {
    const menuLocation = menu?.node?.locations[0];
    const menuNodes = menu?.node?.menuItems?.nodes;

    switch (menuLocation) {
      case 'HSP_NAVIGATION':
        normalizedFooterMenus.hsp.push(...menuNodes);
        break;
      case 'LEGAL_NAVIGATION':
        normalizedFooterMenus.legal.push(...menuNodes);
        break;
      case 'LIFESTYLE_NAVIGATION':
        normalizedFooterMenus.lifestyle.push(...menuNodes);
        break;
      case 'PRODUCTS_NAVIGATION':
        normalizedFooterMenus.products.push(...menuNodes);
        break;
      case 'RESOURCES_NAVIGATION':
        normalizedFooterMenus.resources.push(...menuNodes);
        break;
      case 'SERVICES_NAVIGATION':
        normalizedFooterMenus.services.push(...menuNodes);
        break;
      default:
        break;
    }
  });
  const mainProductCategoryIds = data.mainProductCategories.map(({ id }) => id);
  const productSubCategories = data?.productCategories.filter(
    ({ id, parent }) =>
      mainProductCategoryIds.includes(parent?.node?.id) &&
      !data.excludeChildrenId.includes(id),
  );
  return (
    <GravityFormsStaticDataProvider
      productSubCategories={productSubCategories}
      stores={data.allStores}
    >
      <UserProvider>
        <VehicleProvider>
          <Header
            mainMenu={normalizedMainMenu}
            mainProductCategories={normalizedMainProductCategories}
            makes={data.makes}
            mobileMenu={normalizedMobileMenu}
            products={normalizedProductData}
            secondaryMenu={topNavigationMenu}
          />
          <main className={styles.main}>
            {withMap && (
              <div className={styles.background}>
                <Image
                  alt="Shape of the Australian continent"
                  className={styles.backgroundImage}
                  fill={true}
                  quality={80}
                  src={BgContinent}
                />
              </div>
            )}
            <div
              className={clsx(styles.content, {
                [styles.reserveSpaceForVehicleSelection]:
                  reserveSpaceForVehicleSelection,
              })}
            >
              {children}
            </div>
          </main>
          {withFooter && (
            <div className={styles.bottomSticky}>
              <FullscreenCollapse>
                <Newsletter
                  description={newsletterDescription}
                  googleRecaptchaSitekey={GOOGLE_RECAPTCHA_SITEKEY}
                  title={newsletterTitle}
                />
                <Footer menus={normalizedFooterMenus} text={footerText} />
              </FullscreenCollapse>
            </div>
          )}
          <div id={MODAL_PORTAL_ID} />
        </VehicleProvider>
      </UserProvider>
    </GravityFormsStaticDataProvider>
  );
}
