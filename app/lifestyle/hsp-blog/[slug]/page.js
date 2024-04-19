import { getBlogPost } from '@lib/api/get-blog-post';
import { getRecentBlogPosts } from '@lib/api/get-recent-blog-posts';

import { BlogPost } from '@components/blog-post';
import Layout from '@components/layout/layout';

const NUMBER_OF_RELATED_POSTS = 5;

export default async function BlogPostPage({ params }) {
  const post = await getBlogPost(params.slug);
  const title = post?.title;
  const content = post?.content;
  const excerpt = post?.excerpt;
  const image = post?.featuredImage?.node;
  const slug = post?.uri?.replaceAll('/', '');

  const relatedPosts = await getRecentBlogPosts(NUMBER_OF_RELATED_POSTS);

  return (
    <Layout title={`HSP 4x4 - ${title}`}>
      <BlogPost
        content={content}
        excerpt={excerpt}
        image={image}
        relatedPosts={relatedPosts}
        slug={slug}
        title={title}
      />
    </Layout>
  );
}
