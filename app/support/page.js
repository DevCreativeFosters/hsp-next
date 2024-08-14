import { Fragment } from 'react';

import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { renderBlock } from '@lib/block';
import routes from '@lib/routes';
import { metadata } from '@lib/seo';

import Layout from '@components/layout/layout';

export async function generateMetadata() {
  const data = await getSeoByUri(routes.support());

  return {
    ...metadata,
    ...data,
  };
}
export default async function SupportPage() {
  const content = await getPageData('support');
  const contentBlocks = await Promise.all(
    content?.flexibleContent?.blocks.map(renderBlock) || [],
  );

  return (
    <Layout>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
