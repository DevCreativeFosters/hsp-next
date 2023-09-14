import { getPageData, getMenus, getGlobalOptions } from '@lib/api';
import { renderBlock } from '@lib/block';
import Layout from '@components/layout/layout';

export const metadata = {
  title: 'HSP 4x4 - Australian made',
  // description: ''
};

export default async function AustralianMadePage() {
  const content = await getPageData('australian-made');
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();

  return (
    <Layout menus={menus} globalOptions={globalOptions} withMap>
      {content?.map(renderBlock)}
    </Layout>
  );
}
