import { Fragment } from 'react';
import { getGlobalOptions, getMenus, getPageData } from '@lib/api';
import Layout from '@components/layout/layout';
import { renderBlock } from '@lib/block';

export const metadata = {
  title: 'HSP 4x4 - Support',
  // description: ''
};

export default async function SupportPage() {
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();
  const content = await getPageData('support');
  const contentBlocks = content?.flexibleContent.blocks.map(renderBlock);

  return (
    <Layout menus={menus} globalOptions={globalOptions}>
      {contentBlocks.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
