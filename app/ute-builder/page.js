import { StoreLocatorProvider } from '@contexts/store-locator';

import { getAllMakes } from '@lib/api/get-all-makes';
import getCategoriesToExclude from '@lib/api/get-categories-to-exclude';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { getStores } from '@lib/api/get-stores';
import { removeLeadingSlash } from '@lib/helpers';
import routes from '@lib/routes';
import { metadata } from '@lib/seo';

import Layout from '@components/layout/layout';
import UteBuilderPage from '@components/ute-builder-page/ute-builder-page';

export async function generateMetadata() {
  const tags = [`page:${removeLeadingSlash(routes.uteBuilder)}`];
  const data = await getSeoByUri(routes.uteBuilder, tags);

  return {
    ...metadata,
    ...data,
  };
}

export default async function UteBuilder() {
  const makes = await getAllMakes();
  const allLocations = await getStores();
  const globalOptions = await getGlobalOptions();
  const excludedCategories = await getCategoriesToExclude(globalOptions);

  return (
    <StoreLocatorProvider>
      <Layout withFooter={false}>
        <UteBuilderPage
          allLocations={allLocations}
          excludedCategories={excludedCategories}
          globalOptions={globalOptions}
          makes={makes}
        />
      </Layout>
    </StoreLocatorProvider>
  );
}
