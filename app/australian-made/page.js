import { Fragment } from 'react';

import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { renderBlock } from '@lib/block';
import routes from '@lib/routes';
import { metadata } from '@lib/seo';

import Layout from '@components/layout/layout';

export async function generateMetadata() {
  const data = await getSeoByUri(routes.australianMade);

  return {
    ...metadata,
    ...data,
  };
}

export default async function AustralianMadePage() {
  const content = await getPageData('australian-made');
  const contentBlocks = await Promise.all(
    content?.flexibleContent?.blocks.map(renderBlock) || [],
  );

  return (
    <Layout withMap>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
