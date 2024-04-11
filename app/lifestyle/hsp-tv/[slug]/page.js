import { getHspTvPost } from '@lib/api/get-hsptv-post';
import { getRecentHspTvPosts } from '@lib/api/get-recent-hsptv-posts';

import { HspTvPost } from '@components/hsp-tv-post';
import Layout from '@components/layout/layout';

const NUMBER_OF_RELATED_POSTS = 5;

export default async function HspTVPost({ params }) {
  const post = await getHspTvPost(params.slug);
  const title = post?.title;
  const content = post?.content;
  const slug = post?.uri?.replaceAll('/', '');
  const customFields = post?.hspTvPostCustomFields;

  const relatedPosts = await getRecentHspTvPosts(NUMBER_OF_RELATED_POSTS);

  return (
    <Layout title={`HSP 4x4 - ${title}`}>
      <HspTvPost
        content={content}
        customFields={customFields}
        relatedPosts={relatedPosts}
        slug={slug}
        title={title}
      />
    </Layout>
  );
}
