import Link from 'next/link';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import { getProductCategory, getProductsByCategorySlug } from '@lib/api';

export default async function CategoryPage({ params }) {
  const categorySlugs = params.slug;
  const currentCategorySlug = categorySlugs.pop();
  const categoryData = await getProductCategory(currentCategorySlug);
  const products = await getProductsByCategorySlug(currentCategorySlug);
  const currentCategoryBaseLink = categorySlugs.join('/');

  return (
    <Layout title="Product">
      <Container>
        <h2>{categoryData.name}</h2>
        {categoryData.children.nodes.map(category => (
          <div key={category.databaseId}>
            <Link
              href={`/products/${currentCategoryBaseLink}/${category.slug}`}
            >
              {category.name}
            </Link>
          </div>
        ))}
        {products.map(product => (
          <div key={product.databaseId}>
            <Link href={`/${currentCategoryBaseLink}/${product.slug}`}>
              {product.title}
            </Link>
          </div>
        ))}
      </Container>
    </Layout>
  );
}
