import Layout from '@components/layout/layout';
import Features from '@components/features/features';
import Hero from '@components/hero/hero';
import HeroProductRow from '@components/hero-product-row/hero-product-row';
import Container from '@components/container/container';
import Lifestyle from '@components/lifestyle/lifestyle';
import Tiles from '@components/tiles/tiles';
import FAQ from '@components/faq/faq';
import { features } from '@mockup/features';
import { lifestyle } from '@mockup/lifestyle';
import { faq } from '@mockup/faq';
import { help } from '@mockup/help';

import { getHomepageFlexibleContent } from '@lib/api';

export default async function HomePage() {
  const content = await getHomepageFlexibleContent();
  const blockNamePrefix = 'Page_Flexiblecontent_Blocks';
  const renderBlocks = block => {
    if (block?.fieldGroupName === `${blockNamePrefix}_HeroBlock`) {
      return <Hero slides={block.heroSlides} />;
    }
    if(block?.fieldGroupName === `${blockNamePrefix}_AustralianMadeProductRow`) {
      return <HeroProductRow
        title={block.title}
        products={block.products}
        link={block.allProductsLink}/>
    }
  }

  return (
    <Layout title="HSP 4x4 - Homepage">
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
