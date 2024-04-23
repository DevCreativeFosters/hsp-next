import { Fragment } from 'react';

import { getGlobalOptions } from '@lib/api/get-global-options';
import { getPageData } from '@lib/api/get-page-data';
import { getSeoData } from '@lib/api/getSeoData';
import { renderBlock } from '@lib/block';
import { POST_TYPES } from '@lib/post-types';

import FeaturedPost from '@components/featured-post/featured-post';
import Layout from '@components/layout/layout';

export async function generateMetadata() {
  const data = await getSeoData('lifestyle');

  return {
    ...data,
  };
}

export default async function LifestylePage() {
  const content = await getPageData('lifestyle');
  const globalOptions = await getGlobalOptions();
  const featuredPost = globalOptions?.featuredPost.nodes?.[0];
  const contentBlocks = content?.flexibleContent?.blocks.map(renderBlock);

  return (
    <Layout title="HSP 4x4 - Lifestyle">
      <FeaturedPost
        date={featuredPost?.date}
        excerpt={featuredPost?.hspTvPostCustomFields?.description}
        postType={POST_TYPES.TV}
        slug={featuredPost?.slug}
        tags={featuredPost?.tags}
        title={featuredPost?.title}
        uri={featuredPost?.uri}
        video={featuredPost?.hspTvPostCustomFields?.backgroundVideo?.node}
        youtubeId={featuredPost?.hspTvPostCustomFields?.videoId}
      />
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
