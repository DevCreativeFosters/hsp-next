import Layout from '@components/layout/layout';
import Container from '@components/container/container';
import PageContainer from '@components/page-container/page-container';
import ErrorPage from '@components/error-page';

export default function NotFound() {
  return (
    <Layout withMap>
      <Container>
        <PageContainer>
          <ErrorPage
            title="Page not foundssssss"
            text="Sorry, we couldn't find the page you requested."
            buttonText="Back to Homepage"
          />
        </PageContainer>
      </Container>
    </Layout>
  );
}
