import { getPageData } from '@lib/api';
import Layout from '@components/layout/layout';
import Features from '@components/features/features';
import Hero from '@components/hero/hero';
import HeroProductRow from '@components/hero-product-row/hero-product-row';
import Container from '@components/container/container';
import Lifestyle from '@components/lifestyle/lifestyle';
import Tiles from '@components/tiles/tiles';
import { help } from '@mockup/help';

export default async function HomePage() {
  const content = await getPageData('');
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
  };

  return (
    <Layout title="HSP 4x4 - Homepage">
      {content?.map(block => {
        return renderBlocks(block);
      })}
      <Container>
        <Features />
        <Lifestyle />
        <Tiles
          title={help.title}
          description={help.description}
          buttons={help.buttons}
          tiles={help.tiles}
        />
      </Container>
    </Layout>
  );
}
