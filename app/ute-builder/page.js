import { StoreLocatorProvider } from '@contexts/store-locator';

import { getAllMakes } from '@lib/api/get-all-makes';
import getCategoriesToExclude from '@lib/api/get-categories-to-exclude';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { getStores } from '@lib/api/get-stores';
import { removeLeadingSlash } from '@lib/helpers';
import { prepareSchemas } from '@lib/prepare-schemas';
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
  const content = await getPageData('ute-builder');

  return (
    <StoreLocatorProvider>
      <Layout withFooter={false}>
        {prepareSchemas(content?.schemaProSchemas)}
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
