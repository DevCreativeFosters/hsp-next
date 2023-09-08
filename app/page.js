import { getPageData, getMenus, getGlobalOptions } from '@lib/api';
import { renderBlocks } from '@lib/block';
import Background from '@components/background/background';
import Layout from '@components/layout/layout';

export const metadata = {
  title: 'HSP 4x4 - Homepage',
  // description: ''
};

export default async function HomePage() {
  const content = await getPageData('');
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();
  return (
    <Layout menus={menus} globalOptions={globalOptions} withMap>
      {content?.map(block => {
        const { background } = block;
        const content = renderBlocks(block);
        return background ? (
          <Background colorStops={background}>{content}</Background>
        ) : (
          content
        );
      })}
    </Layout>
  );
}
