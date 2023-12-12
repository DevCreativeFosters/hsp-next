import { Fragment } from 'react';
import { getPageData } from '@lib/api';
import Layout from '@components/layout/layout';
import { renderBlock } from '@lib/block';

export const metadata = {
  title: 'HSP 4x4 - Support',
  // description: ''
};

export default async function SupportPage() {
  const content = await getPageData('support');
  const contentBlocks = content?.flexibleContent?.blocks.map(renderBlock);

  return <Layout>{contentBlocks.map(contentBlock => contentBlock)}</Layout>;
}
