import { Fragment } from 'react';

import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { renderBlock } from '@lib/block';
import { metadata } from '@lib/seo';

import Layout from '@components/layout/layout';

export async function generateMetadata() {
  const data = await getSeoByUri('/');

  return {
    ...metadata,
    ...data,
  };
}

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
