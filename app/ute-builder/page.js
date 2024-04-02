import { StoreLocatorProvider } from '@contexts/store-locator';

import { getAllMakes } from '@lib/api/get-all-makes';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getStores } from '@lib/api/get-stores';
import { getTermChildren } from '@lib/api/get-term-children';

import Layout from '@components/layout/layout';
import UteBuilderPage from '@components/ute-builder-page/ute-builder-page';

export const metadata = {
  title: 'HSP 4x4 - UTE Builder',
  // description: ''
};

export default async function UteBuilder() {
  const makes = await getAllMakes();
  const allLocations = await getStores();
  const globalOptions = await getGlobalOptions();
  const factoryOptions = await getTermChildren(
    globalOptions?.compatibleFactoryOptions?.nodes[0].slug || '',
  );
  const uteCovers = await getTermChildren(
    globalOptions?.coversCategory?.nodes[0].slug || '',
  );

  return (
    <Layout withFooter={false}>
      <StoreLocatorProvider>
        <UteBuilderPage
          makes={makes}
          allLocations={allLocations}
          factoryOptions={factoryOptions}
          uteCovers={uteCovers}
        />
      </StoreLocatorProvider>
    </Layout>
  );
}
