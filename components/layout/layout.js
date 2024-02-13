import clsx from 'clsx';
import Image from 'next/image';
import { GravityFormsStaticDataProvider } from '@contexts/gravity-forms-static-data';
import { UserProvider } from '@contexts/user';
import {
  getFooterMenus,
  getGlobalOptions,
  getMenu,
  getMenuDropdownProducts,
  getMainProductCategories,
  getAllMakes,
  getProductCategories,
  getStores,
} from '@lib/api';
import normalizeMainMenu from '@lib/normalize-main-menu';
import normalizeTopNavigationMenu from '@lib/normalize-top-navigation-menu';
import normalizeSocialMediaMenu from '@lib/normalize-social-media-menu';
import normalizeMobileMenu from '@lib/normalize-mobile-menu';
import normalizeMenuData from '@lib/normalize-mobile-menu-data';
import normalizeProductData from '@lib/normalize-product-data';
import Header from '@components/header/header';
import Footer from '@components/footer/footer';
import { MODAL_PORTAL_ID } from '@components/modal/modal';
import Newsletter from '@components/newsletter/newsletter';
import FullscreenCollapse from '@components/fullscreen-collapse/fullscreen-collapse';
import { VehicleProvider } from '@contexts/vehicle';
import BgContinent from '@assets/images/bg-continent.png';
import styles from './layout.module.scss';

const GOOGLE_RECAPTCHA_SITEKEY =
  process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITEKEY;

async function getLayoutData() {
  const [
    globalOptions,
    footerMenus,
    mainMenu,
    mobileMenu,
    mainProductCategories,
    productCategories,
    products,
    makes,
    allStores,
  ] = await Promise.all([
    getGlobalOptions(),
    getFooterMenus(),
    getMenu('main-menu'),
    getMenu('mobile-navigation'),
    getMainProductCategories(),
    getProductCategories(),
    getMenuDropdownProducts(),
    getAllMakes(),
    getStores(),
  ]);

  return {
    globalOptions,
    footerMenus,
    mainMenu,
    mobileMenu,
    mainProductCategories,
    productCategories,
    products,
    makes,
    allStores,
  };
}

const data = await getLayoutData();

export default function Layout({
  withMap,
  withFooter = true,
  reserveSpaceForVehicleSelection,
  children,
}) {
  const normalizedFooterMenus = {
    hsp: [],
    legal: [],
    lifestyle: [],
    products: [],
    resources: [],
    services: [],
  };
  const footerText = data.globalOptions?.footerText;
  const socialMenu = normalizeSocialMediaMenu(data.globalOptions);
  const topNavigationMenu = normalizeTopNavigationMenu(data.globalOptions);
  const normalizedMainMenu = normalizeMainMenu(data.mainMenu);
  const normalizedMobileMenu = normalizeMobileMenu(data.mobileMenu);
  const normalizedMobileMainMenu = normalizeMenuData(data.mainMenu);
  const normalizedProductData = normalizeProductData(
    data.mainProductCategories,
  );
  normalizedMobileMenu.splice(1, 0, ...normalizedMobileMainMenu);
  const newsletterTitle = data.globalOptions?.newsletterTitle;
  const newsletterDescription = data.globalOptions?.newsletterDescription;

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
  const productSubCategories = data.productCategories.filter(({ parent }) =>
    mainProductCategoryIds.includes(parent?.node?.id),
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
            secondaryMenu={topNavigationMenu}
            socialMenu={socialMenu}
            mobileMenu={normalizedMobileMenu}
            mainProductCategories={data.mainProductCategories}
            products={normalizedProductData}
            makes={data.makes}
          />
          <main className={styles.main}>
            {withMap && (
              <div className={styles.background}>
                <Image
                  className={styles.backgroundImage}
                  src={BgContinent}
                  alt="Shape of Australia continent"
                  fill={true}
                  quality={80}
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
                  googleRecaptchaSitekey={GOOGLE_RECAPTCHA_SITEKEY}
                  title={newsletterTitle}
                  description={newsletterDescription}
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
