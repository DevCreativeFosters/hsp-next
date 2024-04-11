import { StoreLocatorProvider } from '@contexts/store-locator';

import { getStores } from '@lib/api/get-stores';
import routes from '@lib/routes';

import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import FullscreenCollapse from '@components/fullscreen-collapse/fullscreen-collapse';
import InformationBox from '@components/information-box/information-box';
import Layout from '@components/layout/layout';
import StoreLocatorHero from '@components/store-locator-hero/store-locator-hero';
import StoreLocatorResultsAndMap from '@components/store-locator-results-and-map/store-locator-results-and-map';
import StoreLocatorSearch from '@components/store-locator-search/store-locator-search';

import styles from './page.module.scss';

export const metadata = {
  title: 'HSP 4x4 - Store locator',
  // description: ''
};

export const viewport = {
  height: 'device-height',
  initialScale: 1,
  interactiveWidget: 'resizes-visual',
  width: 'device-width',
};

export default async function StoreLocatorPage() {
  const allStores = await getStores();

  return (
    <Layout reserveSpaceForVehicleSelection withMap>
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
      <FullscreenCollapse>
        <InformationBox hideOn="desktop" />
      </FullscreenCollapse>
    </Layout>
  );
}
