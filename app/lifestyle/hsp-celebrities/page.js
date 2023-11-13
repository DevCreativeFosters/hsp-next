import routes from '@lib/routes';
import { getLatestNumberOfHSPCelebritiesPosts } from '@lib/api';
import Layout from '@components/layout/layout';
import Container from '@components/container/container';
import BreadcrumbsLifestyle from '@components/breadcrumbs-lifestyle/breadcrumbs-lifestyle';
import Background from '@components/background/background';
import PageClient from './page-client';

export const metadata = {
  title: 'HSP 4x4 - HSP Celebrities',
  // description: ''
};

const posts = await getLatestNumberOfHSPCelebritiesPosts();

export default async function HSPCelebritiesPage() {
  return (
    <Layout>
      <Background colorStops={[]} containMargins>
        <Container collapseMargin>
          <BreadcrumbsLifestyle
            initialContentTypeRoute={routes.celebrities()}
          />
        </Container>
        <PageClient posts={posts?.celebrities?.nodes} />

        {/*<Newsletter />*/}
      </Background>
    </Layout>
  );
}
