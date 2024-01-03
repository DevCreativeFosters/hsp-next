import { getAllMakes } from '@lib/api';
import { StoreLocatorProvider } from '@contexts/store-locator';
import Layout from '@components/layout/layout';
import UteBuilderPage from '@components/ute-builder-page/ute-builder-page';

export const metadata = {
  title: 'HSP 4x4 - UTE Builder',
  // description: ''
};

export default async function UteBuilder() {
  const makes = await getAllMakes();

  return (
    <Layout withFooter={false}>
      <StoreLocatorProvider>
        <UteBuilderPage makes={makes} />
      </StoreLocatorProvider>
    </Layout>
  );
}
