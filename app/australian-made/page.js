import { Fragment } from 'react';
import { getPageData } from '@lib/api';
import { renderBlock } from '@lib/block';
import Layout from '@components/layout/layout';

export const metadata = {
  title: 'HSP 4x4 - Australian made',
  // description: ''
};

export default async function AustralianMadePage() {
  const content = await getPageData('australian-made');
  const contentBlocks = content?.flexibleContent.blocks.map(renderBlock);

  return (
    <Layout withMap>
      {contentBlocks.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
