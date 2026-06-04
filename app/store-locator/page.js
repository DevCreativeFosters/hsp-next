import { Suspense } from 'react';

import { StoreLocatorProvider } from '@contexts/store-locator';

import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { getStores } from '@lib/api/get-stores';
import { removeLeadingSlash } from '@lib/helpers';
import { prepareSchemas } from '@lib/prepare-schemas';
import routes from '@lib/routes';
import { metadata } from '@lib/seo';

import Layout from '@components/layout/layout';
import StoreLocatorResultsAndMap from '@components/store-locator-results-and-map/store-locator-results-and-map';

import './page.scss';

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
        <StoreLocatorProvider>
          <StoreLocatorResultsAndMap
            allLocations={allStores}
            description={content?.content}
            hideOnMobile={false}
            label={content?.title || 'Locate your store'}
            minHeightLarge
            showFilters
            showStoreLocatorSearch
          />
        </StoreLocatorProvider>
      </Suspense>
    </Layout>
  );
}
