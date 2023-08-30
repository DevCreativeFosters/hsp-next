import BreadcrumbsExample from '@components/breadcrumbs-example/breadcrumbs-example';
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
import { features } from '@mockup/features';
import { lifestyle } from '@mockup/lifestyle';
import { faq } from '@mockup/faq';
import { help } from '@mockup/help';

export default async function HomePage() {
  const content = await getPageData('');
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();
  const blockNamePrefix = 'Page_Flexiblecontent_Blocks';
  const renderBlocks = block => {
    if (block?.fieldGroupName === `${blockNamePrefix}_Hero`) {
      return <Hero slides={block.heroSlides} />;
    }
    if (block?.fieldGroupName === `${blockNamePrefix}_ProductTiles`) {
      return (
        <HeroProductRow
          title={block.title}
          products={block.products}
          link={block.allProductsLink}
        />
      );
    }
    if (block?.fieldGroupName === `${blockNamePrefix}_PromoWith2Videos`) {
      return <PromoWithTwoVideos data={block} />;
    }
    if (block?.fieldGroupName === `${blockNamePrefix}_CategoriesAndProducts`) {
      return <CategoriesAndProducts data={block.links} />;
    }
    if(block?.fieldGroupName === `${blockNamePrefix}_Reviews`) {
      return <Reviews data={block} />;
    }
    if (block?.fieldGroupName === `${blockNamePrefix}_PromoTextAndVideo`) {
      return (
        <TextAndImagePromo
          title={block?.title}
          description={block?.description}
          videoUrl={block?.videoUrl}
          linkText={block?.learnMoreButton?.title}
          linkUrl={block?.learnMoreButton?.url}
        />
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

      <Container>
        <Features
          title={features.title}
          description={features.description}
          cta={features.cta}
          video={features.video}
          features={features.features}
        />
        <Lifestyle
          title={lifestyle.title}
          description={lifestyle.description}
          featured={lifestyle.featured}
          articles={lifestyle.articles}
        />
        <Tiles
          title={help.title}
          description={help.description}
          buttons={help.buttons}
          tiles={help.tiles}
        />
        <FAQ
          title={faq.title}
          description={faq.description}
          buttons={faq.buttons}
          questions={faq.questions}
        />
      </Container>
    </Layout>
  );
}
