import { Fragment } from 'react';
import {
  getGlobalOptions,
  getMenus,
  getPageData,
  getPageGutenbergContent,
} from '@lib/api';
import { renderBlock } from '@lib/block';
import Layout from '@components/layout/layout';

export const metadata = {
  title: 'HSP 4x4 - Support',
  // description: ''
};

export default async function SupportSubpage({ params }) {
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();
  const gutenbergContent = await getPageGutenbergContent(
    `support/${params.slug}`,
  );
  const content = await getPageData(`support/${params.slug}`);
  const contentBlocks = content?.flexibleContent.blocks.map(renderBlock);

  return (
    <Layout menus={menus} globalOptions={globalOptions}>
      {/* Display WordPress Editor Content */}
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
