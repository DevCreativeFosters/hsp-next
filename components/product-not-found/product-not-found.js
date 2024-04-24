import Container from '@components/container/container';
import ErrorPage from '@components/error-page';
import Layout from '@components/layout/layout';
import PageContainer from '@components/page-container/page-container';

export const metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: 'Error 404 - product not found',
};

export default function ProductNotFound() {
  return (
    <Layout withMap>
      <Container>
        <PageContainer>
          <ErrorPage
            buttonText="Back to product catalog"
            product={true}
            text="Sorry, we couldn't find the product you requested."
            title="Product not found"
          />
        </PageContainer>
      </Container>
    </Layout>
  );
}
