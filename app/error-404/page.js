import Container from '@components/container/container';
import ErrorPage from '@components/error-page';
import Layout from '@components/layout/layout';
import PageContainer from '@components/page-container/page-container';

export const metadata = {
  title: 'Error 404 - page not found',
};

export default function NotFound() {
  return (
    <Layout withMap>
      <Container>
        <PageContainer>
          <ErrorPage
            title="Page not found"
            text="Sorry, we couldn't find the page you requested."
            buttonText="Back to Homepage"
          />
        </PageContainer>
      </Container>
    </Layout>
  );
}
