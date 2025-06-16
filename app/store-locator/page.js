import { Suspense } from 'react';

import { StoreLocatorProvider } from '@contexts/store-locator';

import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { getStores } from '@lib/api/get-stores';
import { removeLeadingSlash } from '@lib/helpers';
import { prepareSchemas } from '@lib/prepare-schemas';
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
  const tags = [`page:${removeLeadingSlash(routes.storeLocator)}`, 'store'];
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
  const content = await getPageData('store-locator');

  return (
    <Layout
      preventHeaderCollapse
      reserveSpaceForVehicleSelection
      stickyFooter
      withMap
    >
      {prepareSchemas(content?.schemaProSchemas)}
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
          <StoreLocatorResultsAndMap allLocations={allStores} minHeightLarge />
        </StoreLocatorProvider>
      </Suspense>
    </Layout>
  );
}
