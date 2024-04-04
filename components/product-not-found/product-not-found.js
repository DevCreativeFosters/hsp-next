import Container from '@components/container/container';
import ErrorPage from '@components/error-page';
import Layout from '@components/layout/layout';
import PageContainer from '@components/page-container/page-container';

export const metadata = {
  title: 'Error 404 - product not found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProductNotFound() {
  return (
    <Layout withMap>
      <Container>
        <PageContainer>
          <ErrorPage
            title="Product not found"
            text="Sorry, we couldn't find the product you requested."
            buttonText="Back to product catalog"
            product={true}
          />
        </PageContainer>
      </Container>
    </Layout>
  );
}
