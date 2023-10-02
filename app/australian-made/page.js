import { Fragment } from 'react';
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
  const contentBlocks = await Promise.all(content?.map(renderBlock));

  return (
    <Layout menus={menus} globalOptions={globalOptions} withMap>
      {contentBlocks.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
