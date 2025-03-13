import { Suspense } from 'react';

import { StoreLocatorProvider } from '@contexts/store-locator';

import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { getStores } from '@lib/api/get-stores';
import { removeLeadingSlash } from '@lib/helpers';
import routes from '@lib/routes';
import { metadata } from '@lib/seo';

import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import FullscreenCollapse from '@components/fullscreen-collapse/fullscreen-collapse';
import Layout from '@components/layout/layout';
import StoreLocatorHero from '@components/store-locator-hero/store-locator-hero';
import StoreLocatorResultsAndMap from '@components/store-locator-results-and-map/store-locator-results-and-map';
import StoreLocatorSearch from '@components/store-locator-search/store-locator-search';

import styles from './page.module.scss';

export async function generateMetadata() {
  const tags = [`page:${removeLeadingSlash(routes.storeLocator)}`];
  const data = await getSeoByUri(routes.storeLocator, tags);

  return {
    ...metadata,
    ...data,
  };
}

export const viewport = {
  height: 'device-height',
  initialScale: 1,
  interactiveWidget: 'resizes-visual',
  width: 'device-width',
};

export default async function StoreLocatorPage() {
  const allStores = await getStores();

  return (
    <Layout
      preventHeaderCollapse
      reserveSpaceForVehicleSelection
      stickyFooter
      withMap
    >
      <Suspense fallback={null}>
        <FullscreenCollapse>
          <div className={styles.breadcrumbs}>
            <Breadcrumbs
              items={[
                {
                  label: 'Support',
                  url: routes.support(),
                },
                {},
              ]}
              withContainer={true}
            />
          </div>
          <StoreLocatorHero />
        </FullscreenCollapse>

        <StoreLocatorProvider>
          <StoreLocatorSearch allLocations={allStores} />
          <StoreLocatorResultsAndMap allLocations={allStores} />
        </StoreLocatorProvider>
      </Suspense>
    </Layout>
  );
}
