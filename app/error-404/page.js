import { Fragment } from 'react/jsx-runtime';

import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';
import { metadata as defaultMetadata } from '@lib/seo';

import Container from '@components/container/container';
import ErrorPage from '@components/error-page';
import Layout from '@components/layout/layout';
import PageContainer from '@components/page-container/page-container';

export const metadata = {
  ...defaultMetadata,
  title: 'Error 404 - page not found',
};

export default async function NotFound() {
  const content = await getPageData('/error-404');
  const contentBlocks = await Promise.all(
    content?.flexibleContent?.blocks?.map(renderBlock) || [],
  );

  return (
    <Layout withMap>
      <Container>
        <PageContainer>
          <ErrorPage
            buttonText="Back to Homepage"
            text="Sorry, we couldn't find the page you requested."
            title="Page not found"
          />
        </PageContainer>
      </Container>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
