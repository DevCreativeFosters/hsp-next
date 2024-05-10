import { StoreLocatorProvider } from '@contexts/store-locator';

import { getAllMakes } from '@lib/api/get-all-makes';
import getCategoriesToExclude from '@lib/api/get-categories-to-exclude';
import { getGlobalOptions } from '@lib/api/get-global-options';
import getNoCoverProduct from '@lib/api/get-no-cover-product';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { getStores } from '@lib/api/get-stores';
import routes from '@lib/routes';

import Layout from '@components/layout/layout';
import UteBuilderPage from '@components/ute-builder-page/ute-builder-page';

export async function generateMetadata() {
  const data = await getSeoByUri(routes.uteBuilder);

  return {
    ...data,
  };
}

export default async function UteBuilder() {
  const makes = await getAllMakes();
  const allLocations = await getStores();
  const globalOptions = await getGlobalOptions();
  const noCoverSlug = globalOptions?.noCoverCategory?.nodes[0]?.slug;
  const noCoverProduct = noCoverSlug
    ? await getNoCoverProduct(noCoverSlug)
    : null;
  const excludedCategories = await getCategoriesToExclude(globalOptions);

  return (
    <Layout withFooter={false}>
      <StoreLocatorProvider>
        <UteBuilderPage
          allLocations={allLocations}
          excludedCategories={excludedCategories}
          globalOptions={globalOptions}
          makes={makes}
          noCover={noCoverProduct}
        />
      </StoreLocatorProvider>
    </Layout>
  );
}
