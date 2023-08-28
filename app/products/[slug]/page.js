import BreadcrumbsExample from '@components/breadcrumbs-example/breadcrumbs-example';
import { getMenus, getGlobalOptions } from '@lib/api';
import Layout from '@components/layout/layout';
import Container from '@components/container/container';

export default async function Product() {
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();
  return (
    <Layout title="Product" menus={menus} globalOptions={globalOptions}>
      <Container>
        <BreadcrumbsExample />
      </Container>
    </Layout>
  );
}
