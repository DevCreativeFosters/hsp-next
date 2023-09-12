import { getPageData, getMenus, getGlobalOptions } from '@lib/api';
import Layout from '@components/layout/layout';
import FeaturedPost from '@components/featured-post/featured-post';

export default async function LifestylePage() {
  const content = await getPageData('');
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();
  const featuredPost = globalOptions?.featuredPost;
  const blockNamePrefix = 'Page_Flexiblecontent_Blocks';
  const renderBlocks = block => {
    if (block?.fieldGroupName === `${blockNamePrefix}_`) {
      //
    }
  };

  return (
    <Layout
      title="HSP 4x4 - Lifestyle"
      menus={menus}
      globalOptions={globalOptions}
    >
      <FeaturedPost
        title={featuredPost?.title}
        excerpt={featuredPost?.excerpt}
        uri={featuredPost?.uri}
        videoUrl={featuredPost?.hspTvPostMainVideo?.url}
        tags={featuredPost?.tags}
        date={featuredPost?.date}
        postType="HSP TV"
      />
      {content?.map(block => {
        return renderBlocks(block);
      })}
    </Layout>
  );
}
