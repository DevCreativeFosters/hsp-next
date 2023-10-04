import { Fragment } from 'react';
import { getPageData, getMenus, getGlobalOptions } from '@lib/api';
import { renderBlock } from '@lib/block';
import Layout from '@components/layout/layout';

export const metadata = {
  title: 'HSP 4x4 - Homepage',
  // description: ''
};

export default async function HomePage() {
  const content = await getPageData('');
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();
  const contentBlocks = content?.flexibleContent.blocks.map(renderBlock);

  return (
    <Layout menus={menus} globalOptions={globalOptions} withMap>
      {contentBlocks.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
