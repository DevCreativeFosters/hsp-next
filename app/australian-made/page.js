import { Fragment } from 'react';

import { getPageData } from '@lib/api/get-page-data';
import { getSeoData } from '@lib/api/getSeoData';
import { renderBlock } from '@lib/block';

import Layout from '@components/layout/layout';

export async function generateMetadata() {
  const data = await getSeoData('australian-made');

  return {
    ...data,
  };
}

export default async function AustralianMadePage() {
  const content = await getPageData('australian-made');
  const contentBlocks = content?.flexibleContent?.blocks.map(renderBlock);

  return (
    <Layout withMap>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
