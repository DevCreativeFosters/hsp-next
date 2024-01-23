import { StoreLocatorProvider } from '@contexts/store-locator';
import routes from '@lib/routes';
import Layout from '@components/layout/layout';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import StoreLocatorHero from '@components/store-locator-hero/store-locator-hero';
import InformationBox from '@components/information-box/information-box';
import StoreLocatorSearch from '@components/store-locator-search/store-locator-search';
import StoreLocatorResultsAndMap from '@components/store-locator-results-and-map/store-locator-results-and-map';
import FullscreenCollapse from '@components/fullscreen-collapse/fullscreen-collapse';
import styles from './page.module.scss';

export const metadata = {
  title: 'HSP 4x4 - Store locator',
  // description: ''
};

export const viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  interactiveWidget: 'resizes-visual',
};

export default async function StoreLocatorPage() {
  return (
    <Layout withMap withFooter={false} reserveSpaceForVehicleSelection>
      <FullscreenCollapse>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs
            withContainer={true}
            items={[
              {
                label: 'Support',
                url: routes.support(),
              },
              {},
            ]}
          />
        </div>
        <StoreLocatorHero />
      </FullscreenCollapse>

      <StoreLocatorProvider>
        <StoreLocatorSearch />
        <StoreLocatorResultsAndMap />
      </StoreLocatorProvider>
      <FullscreenCollapse>
        <InformationBox hideOn="desktop" />
      </FullscreenCollapse>
    </Layout>
  );
}
