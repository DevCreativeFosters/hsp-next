import clsx from 'clsx';
import Image from 'next/image';

import { CartProvider } from '@contexts/cart-context';
import { GravityFormsStaticDataProvider } from '@contexts/gravity-forms-static-data';
import { UserProvider } from '@contexts/user';
import { VehicleProvider } from '@contexts/vehicle';
import { WishlistProvider } from '@contexts/wishlist';

import { getAllMakes } from '@lib/api/get-all-makes';
import { getFooterMenus } from '@lib/api/get-footer-menus';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getMainProductCategories } from '@lib/api/get-main-product-categories';
import { getMenu } from '@lib/api/get-menu';
import { getMenuDropdownProducts } from '@lib/api/get-menu-dropdown-products';
import { getProductCategories } from '@lib/api/get-product-categories';
import { getStores } from '@lib/api/get-stores';
import { getExcludeTree, sortMainProductCategories } from '@lib/helpers';
import normalizeMainMenu from '@lib/normalize-main-menu';
import normalizeProductData from '@lib/normalize-product-data';
import normalizeTopNavigationMenu from '@lib/normalize-top-navigation-menu';

import CartSidebar from '@components/cart-sidebar/cart-sidebar';
import Footer from '@components/footer/footer';
import FullscreenCollapse from '@components/fullscreen-collapse/fullscreen-collapse';
import Header from '@components/header/header';
import { MODAL_PORTAL_ID } from '@components/modal/modal';

import BgContinent from '@assets/images/bg-continent.png';

import styles from './layout.module.scss';

const GOOGLE_RECAPTCHA_SITEKEY =
  process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITEKEY;

async function getLayoutData() {
  // TODO: reduce number of requests
  //
  // Every fetch here runs at build time during page-data collection and
  // is awaited by the root layout. If ANY one of them throws (Cloudways
  // hiccup, ACF/WPGraphQL plugin crash, DB hiccup) the entire next build
  // fails — we've already lost deploys to flaky globalOptions and menus
  // resolvers. Wrap each one through `safe()` so a single dead resolver
  // degrades the layout to a sensible default (empty menus, no makes,
  // etc.) instead of killing the deploy. The page renders without that
  // piece of global chrome; everything else still works.
  const safe = async (fetcher, fallback, label) => {
    try {
      return await fetcher();
    } catch (err) {
      console.error(`${label} failed — using fallback:`, err?.message);
      return fallback;
    }
  };

  const globalOptions = await safe(getGlobalOptions, null, 'getGlobalOptions');
  const footerMenus = await safe(getFooterMenus, [], 'getFooterMenus');
  const mainMenu = await safe(() => getMenu('main-menu'), [], 'getMenu(main)');
  const mobileMenu = await safe(
    () => getMenu('mobile-navigation'),
    [],
    'getMenu(mobile)',
  );
  const productCategories = await safe(
    getProductCategories,
    [],
    'getProductCategories',
  );
  const products = await safe(
    getMenuDropdownProducts,
    [],
    'getMenuDropdownProducts',
  );
  const makes = await safe(getAllMakes, [], 'getAllMakes');
  const allStores = await safe(getStores, [], 'getStores');

  const excludeTree = getExcludeTree(globalOptions);
  // Guard the chain through to .databaseId / .id — if globalOptions itself
  // is null (WP returned 500 and getGlobalOptions caught it) the `.nodes`
  // bit short-circuits to undefined, but `[0].databaseId` would still
  // throw without the bracket optional-chain. We end up with [undefined]
  // entries which the downstream getMainProductCategories filters out.
  const excludeChildren = [
    globalOptions?.noCoverCategory?.nodes?.[0]?.databaseId,
  ];
  const excludeChildrenId = [globalOptions?.noCoverCategory?.nodes?.[0]?.id];
  const mainProductCategories = await safe(
    () => getMainProductCategories(excludeTree, excludeChildren),
    [],
    'getMainProductCategories',
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
  isProductPageWithoutMakeAndModel,
  preventHeaderCollapse = false,
  reserveSpaceForVehicleSelection,
  stickyFooter = false,
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
  const normalizedMobileMenu = normalizeMainMenu(data.mobileMenu);
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

  const promoBanner = {
    backgroundColor: data?.globalOptions?.promoBackgroundColor,
    content: data?.globalOptions?.promoContent,
    scrollAnimation: data?.globalOptions?.scrollAnimation,
    textColor: data?.globalOptions?.promoTextColor,
  };

  return (
    <GravityFormsStaticDataProvider
      productSubCategories={productSubCategories}
      stores={data.allStores}
    >
      <UserProvider>
        <VehicleProvider
          isProductPageWithoutMakeAndModel={isProductPageWithoutMakeAndModel}
        >
          <CartProvider>
            <WishlistProvider>
              <div
                className={
                  withFooter && stickyFooter ? styles.fullHeightWrapper : ''
                }
              >
                <Header
                  mainMenu={normalizedMainMenu}
                  mainProductCategories={normalizedMainProductCategories}
                  makes={data.makes}
                  mobileMenu={normalizedMobileMenu}
                  preventHeaderCollapse={preventHeaderCollapse}
                  products={normalizedProductData}
                  promoBanner={promoBanner}
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
                      {/* 
                        <Newsletter
                          description={newsletterDescription}
                          googleRecaptchaSitekey={GOOGLE_RECAPTCHA_SITEKEY}
                          title={newsletterTitle}
                        />
                      */}
                      <Footer menus={normalizedFooterMenus} text={footerText} />
                    </FullscreenCollapse>
                  </div>
                )}
                <div id={MODAL_PORTAL_ID} />
              </div>
              <CartSidebar />
            </WishlistProvider>
          </CartProvider>
        </VehicleProvider>
      </UserProvider>
    </GravityFormsStaticDataProvider>
  );
}
