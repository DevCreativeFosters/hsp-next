import { Suspense } from 'react';

import { draftMode } from 'next/headers';

import { getHspTvPost } from '@lib/api/get-hsptv-post';
import { getRecentHspTvPosts } from '@lib/api/get-recent-hsptv-posts';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { removeLeadingSlash } from '@lib/helpers';
import { metadata } from '@lib/seo';

import { HspTvPost } from '@components/hsp-tv-post';
import Layout from '@components/layout/layout';

const NUMBER_OF_RELATED_POSTS = 5;

export async function generateMetadata({ params }) {
  const tags = [`hsp-tv:${removeLeadingSlash(params.slug)}`];
  const data = await getSeoByUri(`/hsp-tv/${params.slug}`, tags);

  return {
    ...metadata,
    ...data,
  };
}

export default async function HspTVPost({ params }) {
  const { isEnabled: isDraftEnabled } = draftMode();
  const post = await getHspTvPost(params.slug, isDraftEnabled);
  const title = post?.title;
  const content = post?.content;
  const slug = post?.uri?.replaceAll('/', '');
  const customFields = post?.hspTvPostCustomFields;

  const relatedPosts = await getRecentHspTvPosts(NUMBER_OF_RELATED_POSTS);

  return (
    <Layout title={`HSP 4x4 - ${title}`}>
      <Suspense fallback={null}>
        <HspTvPost
          content={content}
          customFields={customFields}
          relatedPosts={relatedPosts}
          slug={slug}
          title={title}
        />
      </Suspense>
    </Layout>
  );
}

export async function generateStaticParams() {
  return [];
}
