import clsx from 'clsx';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import localFont from 'next/font/local';
import NextTopLoader from 'nextjs-toploader';

import { VehicleProvider } from '@contexts/vehicle';

import {
  getResult as getAllMakes,
  query as makesQuery,
} from '@lib/api/get-all-makes';
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
import { ProductWithVariants } from '@lib/api/product-fragments/product-with-variants';
import { fetchAPI } from '@lib/fetch-api';
import { getExcludeTree, sortMainProductCategories } from '@lib/helpers';
import normalizeMainMenu from '@lib/normalize-main-menu';
import normalizeMobileMenu from '@lib/normalize-mobile-menu';
import normalizeProductData from '@lib/normalize-product-data';
import normalizeTopNavigationMenu from '@lib/normalize-top-navigation-menu';

import Header from '@components/header/header';
import PreviewAlert from '@components/preview-alert/preview-alert';

import '@styles/main.scss';

import RootLayoutClient from './layout-client';

const hind = localFont({
  display: 'block',
  src: [
    {
      path: '../assets/fonts/Hind-400-Regular.woff2',
      weight: '400',
    },
    {
      path: '../assets/fonts/Hind-600-SemiBold.woff2',
      weight: '600',
    },
  ],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-hind',
  weight: '400 600',
});

const khand = localFont({
  display: 'block',
  src: [
    {
      path: '../assets/fonts/Khand-400-Regular.woff2',
      weight: '400',
    },
    {
      path: '../assets/fonts/Khand-600-SemiBold.woff2',
      weight: '600',
    },
  ],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-khand',
  weight: '400 600',
});

export const metadata = {
  description: 'HSP',
  title: 'HSP 4x4',
};

export const revalidate = 600;

async function getLayoutData() {
  const bulkQuery = [
    globalOptionsQuery,
    getMenuQuery('mainMenu', 'mainMenuId'),
    getMenuQuery('mobileMenu', 'mobileMenuId'),
    productCategoriesQuery,
    menuDropdownProductsQuery,
    makesQuery,
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
  const mainMenu = getMenu(data, 'mainMenu');
  const mobileMenu = getMenu(data, 'mobileMenu');
  const productCategories = getProductCategories(data);
  const products = getMenuDropdownProducts(data);
  const makes = getAllMakes(data);

  const excludeTree = getExcludeTree(globalOptions);
  const excludeChildren = [globalOptions?.noCoverCategory?.nodes[0].databaseId];
  const excludeChildrenId = [globalOptions?.noCoverCategory?.nodes[0].id];

  const mainProductCategories = await getMainProductCategories(
    excludeChildren,
    excludeTree,
  );

  return {
    excludeChildrenId,
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

export default async function RootLayout({ children }) {
  const downloadFileFormId = data?.globalOptions.downloadFileFormId;
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

  return (
    <html
      className={clsx(hind.variable, khand.variable)}
      data-download-file-form-id={downloadFileFormId}
      lang="en-au"
    >
      <body className="" data-rh="class">
        <ReCaptchaProvider useEnterprise>
          <NextTopLoader color="#ed2935ff" />
          <VehicleProvider>
            <Header
              mainMenu={normalizedMainMenu}
              mainProductCategories={normalizedMainProductCategories}
              makes={data.makes}
              mobileMenu={normalizedMobileMenu}
              products={normalizedProductData}
              secondaryMenu={topNavigationMenu}
            />
            {children}
          </VehicleProvider>
          <PreviewAlert />
          <RootLayoutClient />
        </ReCaptchaProvider>
      </body>
    </html>
  );
}
