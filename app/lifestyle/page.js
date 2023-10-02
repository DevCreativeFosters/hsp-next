import { Fragment } from 'react';
import {
  getPageData,
  getMenus,
  getGlobalOptions,
  getLatestNumberOfBlogPosts,
  getLatestNumberOfHSPTVPosts,
} from '@lib/api';
import Layout from '@components/layout/layout';
import FeaturedPost from '@components/featured-post/featured-post';
import { renderBlock } from '@lib/block';

export default async function LifestylePage() {
  const content = await getPageData('lifestyle');
  const globalOptions = await getGlobalOptions();
  const menus = await getMenus();
  const featuredPost = globalOptions?.featuredPost;
  const contentBlocks = await Promise.all(content?.map(renderBlock));

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
      {contentBlocks.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
