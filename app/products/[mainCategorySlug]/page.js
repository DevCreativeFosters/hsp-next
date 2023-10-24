import Image from 'next/image';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import { getAllMakes, getMainProductCategory } from '@lib/api';
import ChooseVehicleGlobal from '@components/choose-vehicle-global';
import ChooseVehicleLocal from '@components/choose-vehicle-local';

export default async function MainCategoryPage({ params }) {
  const mainCategorySlug = params.mainCategorySlug;
  const categoryData = await getMainProductCategory(mainCategorySlug);
  const mainCategoryDetails = categoryData.mainCategoryDetails;
  const featuredImage = mainCategoryDetails.featuredImage;
  const availableMakes = categoryData.categoryRelations.availableMakes;
  const allMakes = await getAllMakes();

  return (
    <Layout title="Product">
      <Container>
        <h1>Global choose vehicle</h1>
        <ChooseVehicleGlobal makes={allMakes} />
        <br />
        <br />
        <h2>{categoryData.name}</h2>
        <div>
          Description:
          {categoryData.description}
        </div>
        {featuredImage && (
          <Image
            src={featuredImage.mediaItemUrl}
            width={featuredImage.mediaDetails.width}
            height={featuredImage.mediaDetails.height}
            alt=""
          />
        )}
        <div
          dangerouslySetInnerHTML={{ __html: mainCategoryDetails.features }}
        />
        {mainCategoryDetails.fromPrice && (
          <div>from price {mainCategoryDetails.fromPrice}</div>
        )}
        <div>Warranty:</div>
        {mainCategoryDetails.warranty.warrantyTimePeriod}
        {mainCategoryDetails.warranty.warrantyDescription}

        <ChooseVehicleLocal
          mainCategorySlug={mainCategorySlug}
          makes={availableMakes}
        />
      </Container>
    </Layout>
  );
}
