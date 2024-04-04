import { Fragment } from 'react';

import { getGlobalOptions } from '@lib/api/get-global-options';
import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';
import { POST_TYPES } from '@lib/post-types';

import FeaturedPost from '@components/featured-post/featured-post';
import Layout from '@components/layout/layout';

export default async function LifestylePage() {
  const content = await getPageData('lifestyle');
  const globalOptions = await getGlobalOptions();
  const featuredPost = globalOptions?.featuredPost.nodes?.[0];
  const contentBlocks = content?.flexibleContent?.blocks.map(renderBlock);

  return (
    <Layout title="HSP 4x4 - Lifestyle">
      <FeaturedPost
        title={featuredPost?.title}
        excerpt={featuredPost?.hspTvPostCustomFields?.description}
        uri={featuredPost?.uri}
        slug={featuredPost?.slug}
        video={featuredPost?.hspTvPostCustomFields?.backgroundVideo?.node}
        youtubeId={featuredPost?.hspTvPostCustomFields?.videoId}
        tags={featuredPost?.tags}
        date={featuredPost?.date}
        postType={POST_TYPES.TV}
      />
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
