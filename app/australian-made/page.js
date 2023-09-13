import { getPageData, getMenus, getGlobalOptions } from '@lib/api';
import Layout from '@components/layout/layout';
import VideoBackgroundHero from '@components/video-background-hero/video-background-hero';
import PromoImageText from '@components/promo-image-text/promo-image-text';
import InformationCards from '@components/information-cards/information-cards';

export default async function AustralianMadePage() {
  const content = await getPageData('australian-made');
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();
  const blockNamePrefix = 'Page_Flexiblecontent_Blocks';

  const renderBlocks = block => {
    if (block?.fieldGroupName === `${blockNamePrefix}_VideoBackgroundHero`) {
      return (
        <VideoBackgroundHero
          title={block?.title}
          description={block?.description}
          linkLabel={block?.link?.title}
          videoUrl={block?.backgroundUrl}
        />
      );
    }
    if (block?.fieldGroupName === `${blockNamePrefix}_PromoImageAndText`) {
      return (
        <PromoImageText
          title={block?.title}
          description={block?.description}
          image={block?.image}
        />
      );
    }
    if (block?.fieldGroupName === `${blockNamePrefix}_InformationCards`) {
      return <InformationCards cards={block?.cards} />;
    }
  };

  return (
    <Layout
      title="HSP 4x4 - Australian made"
      menus={menus}
      globalOptions={globalOptions}
    >
      {content?.map(block => {
        return renderBlocks(block);
      })}
    </Layout>
  );
}
