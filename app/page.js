import Layout from '@components/layout/layout';
import Hero from '@components/hero/hero';
import { getHomepageFlexibleContent } from '@lib/api';

export default async function Home() {
  const content = await getHomepageFlexibleContent();
  const blockNamePrefix = 'Page_Flexiblecontent_Blocks';

  const renderBlocks = (block) => {
    if(block?.fieldGroupName === `${blockNamePrefix}_HeroBlock`) {
      return <Hero slides={block.heroSlides} />
    }
  }

  return (
    <Layout>
      {content?.map((block) => {
        return renderBlocks(block);
      })}
    </Layout>
  );
}
