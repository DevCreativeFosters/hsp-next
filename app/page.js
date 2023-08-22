import { getHomepageFlexibleContent } from '@lib/api';
import Hero from '@components/hero/hero';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Features from '@components/features/features';
import Lifestyle from '@components/lifestyle/lifestyle';

export default async function HomePage() {
  const content = await getHomepageFlexibleContent();
  const blockNamePrefix = 'Page_Flexiblecontent_Blocks';
  const renderBlocks = block => {
    if (block?.fieldGroupName === `${blockNamePrefix}_HeroBlock`) {
      return <Hero slides={block.heroSlides} />;
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
      </Container>
    </Layout>
  );
}
