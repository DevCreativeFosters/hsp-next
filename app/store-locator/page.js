import { StoreLocatorProvider } from '@contexts/store-locator';
import routes from '@lib/routes';
import { getGlobalOptions, getMenus } from '@lib/api';
import Layout from '@components/layout/layout';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import StoreLocatorHero from '@components/store-locator-hero/store-locator-hero';
import Search from '@components/store-locator-search/search';
import ResultsAndMap from '@components/store-locator-search/results-and-map';
import FullscreenCollapse from '@components/fullscreen-collapse/fullscreen-collapse';
import styles from './page.module.scss';

export const metadata = {
  title: 'HSP 4x4 - Store locator',
  // description: ''
  viewport:
    'width=device-width, height=device-height, initial-scale=1.0, interactive-widget=resizes-visual',
};

export default async function StoreLocatorPage() {
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();

  return (
    <Layout
      menus={menus}
      globalOptions={globalOptions}
      withMap
      withFooter={false}
    >
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
        <Search />
        <ResultsAndMap />
      </StoreLocatorProvider>
    </Layout>
  );
}
