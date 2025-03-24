import { Fragment } from 'react';

import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { renderBlock } from '@lib/block';
import { removeLeadingSlash } from '@lib/helpers';
import { prepareSchemas } from '@lib/prepare-schemas';
import routes from '@lib/routes';
import { metadata } from '@lib/seo';

import Layout from '@components/layout/layout';

export async function generateMetadata() {
  const tags = [`page:${removeLeadingSlash(routes.support())}`];
  const data = await getSeoByUri(routes.support(), tags);

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
      {prepareSchemas(content?.schemaProSchemas)}
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
