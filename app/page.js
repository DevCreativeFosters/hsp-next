import { getPageData, getMenus, getGlobalOptions } from '@lib/api';
import Layout from '@components/layout/layout';
import Features from '@components/features/features';
import Hero from '@components/hero/hero';
import HeroProductRow from '@components/hero-product-row/hero-product-row';
import Container from '@components/container/container';
import Lifestyle from '@components/lifestyle/lifestyle';
import Tiles from '@components/tiles/tiles';
import FAQ from '@components/faq/faq';
import PromoWithTwoVideos from '@components/promos-with-two-videos/promos-with-two-videos';
import CategoriesAndProducts from '@components/categories-and-products/categories-and-products';
import Reviews from '@components/reviews/reviews';
import TextAndImagePromo from '@components/text-and-image-promo/text-and-image-promo';

export default async function HomePage() {
  const content = await getPageData('');
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();
  const blockNamePrefix = 'Page_Flexiblecontent_Blocks_';
  const renderBlocks = block => {
    const blockName = block?.fieldGroupName.slice(blockNamePrefix.length);

    if ('Hero' === blockName) {
      return <Hero slides={block.heroSlides} />;
    }

    if ('ProductTiles' === blockName) {
      return (
        <HeroProductRow
          title={block.title}
          products={block.products}
          link={block.allProductsLink}
        />
      );
    }

    if ('PromoWith2Videos' === blockName) {
      return <PromoWithTwoVideos data={block} />;
    }

    if ('CategoriesAndProducts' === blockName) {
      return <CategoriesAndProducts data={block.links} />;
    }

    if ('FeaturesValues' === blockName) {
      return (
        <Container>
          <Features
            title={block.sectionTitle}
            description={block.description}
            cta={{
              label: block.buttonLink.title,
              url: block.buttonLink.url,
            }}
            video={{
              src: block.videoUrl,
              title: block.sectionTitle,
              poster: block.videoThumbnailImage.sourceUrl,
            }}
            features={block.attributes}
          />
        </Container>
      );
    }

    if ('Reviews' === blockName) {
      return <Reviews data={block} />;
    }

    if ('Lifestyle' === blockName) {
      return (
        <Container>
          <Lifestyle
            title={block.title}
            description={block.description}
            buttons={block.buttons}
            featured={block.featuredPost}
            posts={block.posts || []}
          />
        </Container>
      );
    }

    if ('Reviews' === blockName) {
      return <Reviews data={block} />;
    }

    if ('PromoTextAndVideo' === blockName) {
      return (
        <TextAndImagePromo
          title={block.title}
          description={block.description}
          videoUrl={block.videoUrl}
          linkText={block.learnMoreButton?.title}
          linkUrl={block.learnMoreButton?.url}
        />
      );
    }

    if ('Tiles' === blockName) {
      return (
        <Container>
          <Tiles
            title={block.title}
            description={block.description}
            buttons={block.buttons}
            tiles={block.tiles}
          />
        </Container>
      );
    }

    if ('Faq' === blockName) {
      return (
        <Container>
          <FAQ
            title={block.title}
            description={block.description}
            buttons={block.buttons}
            questions={block.questions}
          />
        </Container>
      );
    }
  };

  return (
    <Layout
      title="HSP 4x4 - Homepage"
      menus={menus}
      globalOptions={globalOptions}
    >
      {content?.map(block => {
        return renderBlocks(block);
      })}
    </Layout>
  );
}
