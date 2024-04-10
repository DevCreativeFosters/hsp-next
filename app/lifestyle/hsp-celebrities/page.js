import { getLatestNumberOfHSPCelebritiesPosts } from '@lib/api/get-latest-number-of-HSP-celebrities-posts';
import { getPageData } from '@lib/api/get-page-data';
import routes from '@lib/routes';

import Background from '@components/background/background';
import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';

import PageClient from './page-client';

export const metadata = {
  title: 'HSP 4x4 - HSP Celebrities',
  // description: ''
};

export default async function HSPCelebritiesPage() {
  const posts = await getLatestNumberOfHSPCelebritiesPosts(9999);
  const content = await getPageData('lifestyle/hsp-celebrities');
  return (
    <Layout reserveSpaceForVehicleSelection>
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
