import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import {
  getMainProductCategory,
  getMake,
  getProductsByCategoriesSlugs,
} from '@lib/api';

export default async function CategoryPage({ params }) {
  const mainCategorySlug = params.mainCategorySlug;
  const makeSlug = params.makeSlug;
  const modelSlug = params.modelSlug;
  const mainCategory = await getMainProductCategory(mainCategorySlug);
  const make = await getMake(makeSlug);
  const products = await getProductsByCategoriesSlugs(
    mainCategorySlug,
    makeSlug,
    modelSlug,
  );
  const firstMatchedProduct = products.length ? products[0] : null;
  console.log(params);
  if (!firstMatchedProduct) {
    return (
      <Layout title="Product">
        <Container>No product found.</Container>
      </Layout>
    );
  }

  return (
    <Layout title="Product">
      <Container>
        <h1>{mainCategory.name}</h1>
        <h2>
          {make.name} {firstMatchedProduct?.title}
        </h2>
      </Container>
    </Layout>
  );
}
