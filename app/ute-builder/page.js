import { getAllMakes, getStores } from '@lib/api';
import { StoreLocatorProvider } from '@contexts/store-locator';
import Layout from '@components/layout/layout';
import UteBuilderPage from '@components/ute-builder-page/ute-builder-page';

export const metadata = {
  title: 'HSP 4x4 - UTE Builder',
  // description: ''
};

export default async function UteBuilder() {
  const makes = await getAllMakes();
  const allLocations = await getStores();

  return (
    <Layout withFooter={false}>
      <StoreLocatorProvider>
        <UteBuilderPage makes={makes} allLocations={allLocations} />
      </StoreLocatorProvider>
    </Layout>
  );
}
