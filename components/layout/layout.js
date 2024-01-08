import Newsletter from '@components/newsletter/newsletter';
import clsx from 'clsx';
import Image from 'next/image';
import {
  getFooterMenus,
  getGlobalOptions,
  getMenu,
  getMenuDropdownProducts,
  getMainProductCategories,
  getAllMakes,
} from '@lib/api';
import normalizeMainMenu from '@lib/normalize-main-menu';
import normalizeTopNavigationMenu from '@lib/normalize-top-navigation-menu';
import normalizeSocialMediaMenu from '@lib/normalize-social-media-menu';
import normalizeMobileMenu from '@lib/normalize-mobile-menu';
import normalizeMenuData from '@lib/normalize-mobile-menu-data';
import normalizeProductData from '@lib/normalize-product-data';
import Footer from '@components/footer/footer';
import Header from '@components/header/header';
import BgContinent from '@assets/images/bg-continent.png';
import FullscreenCollapse from '@components/fullscreen-collapse/fullscreen-collapse';
import styles from './layout.module.scss';
import { VehicleProvider } from '@contexts/vehicle';

async function getLayoutData() {
  const globalOptions = await getGlobalOptions();
  const footerMenus = await getFooterMenus();
  const mainMenu = await getMenu('main-menu');
  const mobileMenu = await getMenu('mobile-navigation');
  const productCategories = await getMainProductCategories();
  const products = await getMenuDropdownProducts();
  const makes = await getAllMakes();

  return {
    globalOptions,
    footerMenus,
    mainMenu,
    mobileMenu,
    productCategories,
    products,
    makes,
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
  const normalizedProductData = normalizeProductData(data.productCategories);
  normalizedMobileMenu.splice(1, 0, ...normalizedMobileMainMenu);

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

  return (
    <>
      <VehicleProvider>
        <Header
          mainMenu={normalizedMainMenu}
          secondaryMenu={topNavigationMenu}
          socialMenu={socialMenu}
          mobileMenu={normalizedMobileMenu}
          productCategories={data.productCategories}
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
              <Newsletter />
              <Footer menus={normalizedFooterMenus} text={footerText} />
            </FullscreenCollapse>
          </div>
        )}
      </VehicleProvider>
    </>
  );
}
