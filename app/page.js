import { getPageData, getMenus, getGlobalOptions } from '@lib/api';
import Layout from '@components/layout/layout';
import { renderBlocks } from '@lib/block';

export const metadata = {
  title: 'HSP 4x4 - Homepage',
  // description: ''
};

export default async function HomePage() {
  const content = await getPageData('');
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();

  return (
    <Layout menus={menus} globalOptions={globalOptions}>
      {content?.map(block => {
        return renderBlocks(block);
      })}
    </Layout>
  );
}
