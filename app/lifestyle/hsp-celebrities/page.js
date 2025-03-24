import { getLatestNumberOfHSPCelebritiesPosts } from '@lib/api/get-latest-number-of-HSP-celebrities-posts';
import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { removeLeadingSlash } from '@lib/helpers';
import { prepareSchemas } from '@lib/prepare-schemas';
import routes from '@lib/routes';
import { metadata } from '@lib/seo';

import Background from '@components/background/background';
import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';

import PageClient from './page-client';

export async function generateMetadata() {
  const tags = [`page:${removeLeadingSlash(routes.lifestyleCelebrities)}`];
  const data = await getSeoByUri(routes.lifestyleCelebrities, tags);

  return {
    ...metadata,
    ...data,
  };
}

export default async function HSPCelebritiesPage() {
  const posts = await getLatestNumberOfHSPCelebritiesPosts(9999);
  const content = await getPageData('lifestyle/hsp-celebrities');
  return (
    <Layout reserveSpaceForVehicleSelection>
      {prepareSchemas(content?.schemaProSchemas)}
      <Background colorStops={[]} containMargins>
        <Container collapseMargin>
          <BreadcrumbsLifestyle
            initialContentTypeRoute={routes.celebrities()}
          />
        </Container>
        <PageClient
          description={content?.content}
          posts={posts?.celebrities?.nodes}
          title={content?.title}
        />
        {/*<Newsletter />*/}
      </Background>
    </Layout>
  );
}
