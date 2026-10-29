import { Fragment } from 'react';

import { getAllMakes } from '@lib/api/get-all-makes';
import { getCollectionBlocks } from '@lib/api/get-collection-blocks';
import { renderBlock } from '@lib/block';
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

// Blocks are optional extras on a collection. If the blocks query fails
// (e.g. a WP/ACF schema hiccup) the collection should still render its
// hero and product grid, so swallow the error and render without blocks.
async function getRenderedBlocks(slug, params) {
  try {
    const [blocks, makes] = await Promise.all([
      getCollectionBlocks(slug),
      getAllMakes(),
    ]);

    return await Promise.all(
      blocks.map(block => renderBlock(block, makes, [], params)),
    );
  } catch (err) {
    console.error(
      `getCollectionBlocks(${slug}) failed — rendering without blocks:`,
      err?.message,
    );
    return [];
  }
}

async function VehicleSelector({ params }) {
  const { slug } = await params;
  const [data, contentBlocks] = await Promise.all([
    getData(slug),
    getRenderedBlocks(slug, params),
  ]);
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
            url: item.link,
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
      {contentBlocks.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}

export default VehicleSelector;
