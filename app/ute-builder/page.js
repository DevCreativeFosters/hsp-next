import { StoreLocatorProvider } from '@contexts/store-locator';

import { getAllMakes } from '@lib/api/get-all-makes';
import getCategoriesToExclude from '@lib/api/get-categories-to-exclude';
import { getGlobalOptions } from '@lib/api/get-global-options';
import getNoCoverProduct from '@lib/api/get-no-cover-product';
import { getStores } from '@lib/api/get-stores';
import { getTermChildren } from '@lib/api/get-term-children';
import { getSeoData } from '@lib/api/getSeoData';
import routes from '@lib/routes';

import Layout from '@components/layout/layout';
import UteBuilderPage from '@components/ute-builder-page/ute-builder-page';

export async function generateMetadata() {
  const data = await getSeoData(routes.uteBuilder);

  return {
    ...data,
  };
}

export default async function UteBuilder() {
  const makes = await getAllMakes();
  const allLocations = await getStores();
  const globalOptions = await getGlobalOptions();
  const factoryOptions = await getTermChildren(
    globalOptions?.compatibleFactoryOptions?.nodes[0].slug || '',
  );

  const noCoverProduct = await getNoCoverProduct(
    globalOptions.noCoverCategory.nodes[0].slug,
  );
  const excludedCategories = await getCategoriesToExclude(globalOptions);

  return (
    <Layout withFooter={false}>
      <StoreLocatorProvider>
        <UteBuilderPage
          allLocations={allLocations}
          excludedCategories={excludedCategories}
          factoryOptions={factoryOptions}
          globalOptions={globalOptions}
          makes={makes}
          noCover={noCoverProduct}
        />
      </StoreLocatorProvider>
    </Layout>
  );
}
