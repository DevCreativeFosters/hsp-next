import { Fragment } from 'react';

import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';

import Layout from '@components/layout/layout';

export const metadata = {
  title: 'HSP 4x4 - Homepage',
  // description: ''
};

export default async function HomePage() {
  const content = await getPageData('');
  const contentBlocks = content?.flexibleContent?.blocks?.map(renderBlock);

  return (
    <Layout withMap>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
