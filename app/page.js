import { Fragment } from 'react';

import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { renderBlock } from '@lib/block';
import { prepareSchemas } from '@lib/prepare-schemas';
import { metadata } from '@lib/seo';

import Layout from '@components/layout/layout';

export async function generateMetadata() {
  const tags = ['page:home', 'page:/'];
  const data = await getSeoByUri('/', tags);

  return {
    ...metadata,
    ...data,
  };
}

export default async function HomePage() {
  const content = await getPageData('/');
  const contentBlocks = await Promise.all(
    content?.flexibleContent?.blocks?.map(renderBlock) || [],
  );

  return (
    <Layout withMap>
      {/* Scoped body background override for the home route only.
          The site-wide default (styles/globals/_defaults.scss) is
          #181616; home wants #0C0C0C. Inline <style> tags unmount
          on route change, so navigating away from / reverts to
          the site default automatically — no route-listener or
          body class management needed. */}
      <style>{`body { background: #0C0C0C; }`}</style>
      {prepareSchemas(content?.schemaProSchemas)}
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
