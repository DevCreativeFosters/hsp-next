import Image from 'next/image';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import { getMake } from '@lib/api';

export default async function CategoryPage({ params }) {
  const mainCategorySlug = params.mainCategorySlug;
  const makeSlug = params.makeSlug;
  const makeData = await getMake(makeSlug);
  const details = makeData.detailsFields.details;
  const filteredData = details?.filter(
    data => data.relatedProductCategory.slug === mainCategorySlug,
  );

  return (
    <Layout title="Product">
      <Container>
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
