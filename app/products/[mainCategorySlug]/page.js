import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductHero from '@components/product-hero';
import formatCategories from '@lib/normalize-product-breadcrumbs';
import BreadcrumbsProduct from '@components/breadcrumbs-product';
import {
  getCategoriesAndMakesAndModels,
  getMainProductCategory,
} from '@lib/api';

export default async function MainCategoryPage({ params }) {
  const mainCategorySlug = params.mainCategorySlug;
  const categoryData = await getMainProductCategory(mainCategorySlug);
  const mainCategoryDetails = categoryData.mainCategoryDetails;
  const featuredImage = mainCategoryDetails.featuredImage;
  const currentProduct = {
    mainCategory: {
      label: categoryData.name,
      value: mainCategorySlug,
    },
    make: {
      label: '',
      value: '',
    },
    model: {
      label: '',
      value: '',
    },
  };

  const categoryMakesAndModels = await getCategoriesAndMakesAndModels();
  const categories = formatCategories(categoryMakesAndModels);

  return (
    <Layout title="Product">
      <Container>
        <BreadcrumbsProduct
          currentProduct={currentProduct}
          categories={categories}
        />
        <ProductHero
          title={categoryData?.name}
          description={categoryData?.description}
          image={featuredImage}
          features={{
            content: mainCategoryDetails?.features,
          }}
          warranty={{
            content: mainCategoryDetails?.warranty.warrantyDescription,
            years: mainCategoryDetails?.warranty.warrantyTimePeriod,
          }}
        />
      </Container>
    </Layout>
  );
}
