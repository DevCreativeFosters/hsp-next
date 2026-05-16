import { fetchAPI } from '@lib/fetch-api';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductHero from '@components/product-hero';
import ProductMakeGrid from '@components/product-make-grid/product-make-grid';

const query = `
  query GetVehicle($slug: String!) {
    vehicleBySlug(slug: $slug) {
      selected {
        id
        name
        slug
        url
        parent {
          id
          name
          slug
        }
        items {
          link
          title
          image
          price
          date
        }
        title
        slogan
        featuredImage {
          altText
          mediaItemUrl
          mediaDetails {
            width
            height
          }
        }
        featuredImageMobile {
          altText
          mediaItemUrl
          mediaDetails {
            width
            height
          }
        }
      }
    }
  }
`;

async function getData(slug) {
  const vehicle = await fetchAPI(query, { variables: { slug } });

  return {
    model: vehicle?.vehicleBySlug?.selected,
  };
}

async function VehicleSelector({ params }) {
  const { slug } = await params;
  const data = await getData(slug);
  const model = data.model;

  return (
    <Layout title="Vehicle Selector | HSP">
      <Container>
        <div style={{ height: '40px' }} />
        <ProductHero
          customTitle={{
            slogan: model.slogan,
            title: model.title + ' ',
          }}
          description={null}
          image={model.featuredImage}
          make={undefined}
          mobileImage={model.featuredImageMobile}
          title={model.name}
        />
      </Container>
      <ProductMakeGrid
        alignment={'left'}
        bodyText={null}
        categoryPages={[]}
        products={model.items.map(item => ({
          dateAdded: item.date,
          link: {
            url: item.link ? item.link.replace(/^https?:\/\/[^/]+/, '') : '',
          },
          productImage: {
            node: {
              mediaItemUrl: item.image,
            },
          },
          startingPrice: item.price,
          title: item.title,
        }))}
        productsPerPage={12}
        productsPerPageMobile={6}
        productsTitleTag={['h3']}
        productsTitleTagStyle={['h5']}
        showCategories={true}
        showFilters={true}
        showMakes={false}
        template={'showViewProductBtn'}
        title={null}
        titleTag={['h2']}
        titleTagStyle={['h2']}
      />
    </Layout>
  );
}

export default VehicleSelector;
