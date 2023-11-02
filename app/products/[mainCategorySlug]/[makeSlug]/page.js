import Image from 'next/image';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import PageContainer from '@components/page-container/page-container';
import ProductHero from '@components/product-hero';
import { getMake, getMainProductCategory } from '@lib/api';

export default async function CategoryPage({ params }) {
  const mainCategorySlug = params.mainCategorySlug;
  const categoryData = await getMainProductCategory(mainCategorySlug);
  const mainCategoryDetails = categoryData.mainCategoryDetails;
  const featuredImage = mainCategoryDetails.featuredImage;
  const makeSlug = params.makeSlug;
  const makeData = await getMake(makeSlug);
  const details = makeData.detailsFields.details;
  const filteredData = details?.filter(
    data => data.relatedProductCategory.slug === mainCategorySlug,
  );
  const productHeroData = {
    image:
      filteredData.length > 1 ? filteredData[0].featuredImage : featuredImage,
    features:
      filteredData.length > 1
        ? filteredData[0]?.features
        : mainCategoryDetails?.features,
    warrantyDescription:
      filteredData.length > 1
        ? filteredData[0]?.warranty.warrantyDescription
        : mainCategoryDetails?.warranty.warrantyDescription,
    warrantyTimePeriod:
      filteredData.length > 1
        ? filteredData[0]?.warranty.warrantytimePeriod
        : mainCategoryDetails?.warranty.warrantyTimePeriod,
  };

  return (
    <Layout title="Product">
      <Container>
        <PageContainer>
          <ProductHero
            make={makeData.name}
            title={categoryData?.name}
            description={makeData?.description || categoryData?.description}
            image={productHeroData.image}
            features={{
              content: productHeroData.features,
            }}
            warranty={{
              content: productHeroData.warrantyDescription,
              years: productHeroData.warrantyTimePeriod,
            }}
          />
        </PageContainer>
        <h2>{makeData.name}</h2>
        {filteredData?.featuredImage && (
          <Image
            src={filteredData.featuredImage.mediaItemUrl}
            width={filteredData.featuredImage.mediaDetails.width}
            height={filteredData.featuredImage.mediaDetails.height}
            alt=""
          />
        )}
        <div>
          Features:{' '}
          {filteredData?.features && (
            <div dangerouslySetInnerHTML={{ __html: filteredData?.features }} />
          )}
        </div>
        <div>From Price: {filteredData?.fromPrice}</div>
        <div>
          Warranty Time Period: {filteredData?.warranty?.warrantyTimePeriod}
        </div>
        <div>
          Warranty Description: {filteredData?.warranty?.warrantyDescription}
        </div>
      </Container>
    </Layout>
  );
}
