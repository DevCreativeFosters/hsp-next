import { getPageData, getMenus, getGlobalOptions } from '@lib/api';
import Layout from '@components/layout/layout';
import VideoBackgroundHero from '@components/video-background-hero/video-background-hero';

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
