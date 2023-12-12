import { getPageData, getGlobalOptions } from '@lib/api';
import { renderBlock } from '@lib/block';
import { POST_TYPES } from '@lib/post-types';
import Layout from '@components/layout/layout';
import FeaturedPost from '@components/featured-post/featured-post';

export default async function LifestylePage() {
  const content = await getPageData('lifestyle');
  const globalOptions = await getGlobalOptions();
  const featuredPost = globalOptions?.featuredPost;
  const contentBlocks = content?.flexibleContent?.blocks.map(renderBlock);

  return (
    <Layout title="HSP 4x4 - Lifestyle">
      <FeaturedPost
        title={featuredPost?.title}
        excerpt={featuredPost?.hspTvPostCustomFields?.description}
        uri={featuredPost?.uri}
        slug={featuredPost?.slug}
        video={featuredPost?.hspTvPostCustomFields?.backgroundVideo}
        youtubeId={featuredPost?.hspTvPostCustomFields?.videoId}
        tags={featuredPost?.tags}
        date={featuredPost?.date}
        postType={POST_TYPES.TV}
      />
      {contentBlocks.map(contentBlock => contentBlock)}
    </Layout>
  );
}
